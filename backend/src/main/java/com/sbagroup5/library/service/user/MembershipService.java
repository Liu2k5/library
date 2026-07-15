package com.sbagroup5.library.service.user;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

import com.sbagroup5.library.entity.payment.PaymentStatus;
import com.sbagroup5.library.entity.payment.PaymentType;
import com.sbagroup5.library.entity.user.Membership;
import com.sbagroup5.library.entity.user.MembershipType;
import com.sbagroup5.library.entity.user.User;
import com.sbagroup5.library.entity.user.UserStatus;
import com.sbagroup5.library.exception.BusinessException;
import com.sbagroup5.library.record.membership.MembershipResponse;
import com.sbagroup5.library.record.membership.MembershipTypeResponse;
import com.sbagroup5.library.record.payment.PaymentRequest;
import com.sbagroup5.library.record.payment.PaymentResponse;
import com.sbagroup5.library.repository.payment.PaymentRepository;
import com.sbagroup5.library.repository.user.MembershipRepository;
import com.sbagroup5.library.repository.user.MembershipTypeRepository;
import com.sbagroup5.library.service.notification.NotificationService;
import com.sbagroup5.library.service.payment.PaymentProcessingService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class MembershipService {

    private final MembershipRepository membershipRepository;
    private final MembershipTypeRepository membershipTypeRepository;
    private final PaymentRepository paymentRepository;
    private final UserService userService;
    private final PaymentProcessingService paymentProcessingService;
    private final NotificationService notificationService;

    private static final int RENEWAL_THRESHOLD_DAYS = 3;
    private static final int MEMBERSHIP_DURATION_YEARS = 1;

    /**
     * Get all active membership types
     */
    public List<MembershipTypeResponse> getAllMembershipTypes() {
        return membershipTypeRepository.findAll().stream()
                .filter(type -> type.getUserStatus() == UserStatus.ACTIVE)
                .map(this::toMembershipTypeResponse)
                .toList();
    }

    /**
     * Get current membership of a user
     */
    public MembershipResponse getCurrentMembership(String username) {
        User user = userService.getUserByUsername(username);
        Membership membership = membershipRepository.findByUser(user).orElse(null);

        if (membership == null) {
            return null;
        }

        return toMembershipResponse(membership);
    }

    /**
     * Register new membership
     */
    @Transactional
    public PaymentResponse registerMembership(String username, Long membershipTypeId) {
        User user = userService.getUserByUsername(username);

        if (membershipRepository.existsByUser(user)) {
            throw new BusinessException("User already has a membership", "MEMBERSHIP_EXISTS");
        }

        if (paymentRepository.existsByUserAndTypeAndStatus(user, PaymentType.MEMBERSHIP, PaymentStatus.PENDING)) {
            throw new BusinessException("You have a pending payment. Please complete or cancel it first.",
                    "PENDING_PAYMENT_EXISTS");
        }

        MembershipType type = getMembershipTypeById(membershipTypeId);

        PaymentRequest paymentRequest = new PaymentRequest(
                PaymentType.MEMBERSHIP,
                type.getPrice(),
                null,
                membershipTypeId);

        PaymentResponse paymentResponse = paymentProcessingService.createPayment(username, paymentRequest);

        paymentProcessingService.setMembershipTypeIdForPayment(paymentResponse.id(), membershipTypeId);

        log.info("User {} registered for membership type: {}", username, type.getName());
        return paymentResponse;
    }

    /**
     * Renew membership
     */
    @Transactional
    public PaymentResponse renewMembership(String username) {
        User user = userService.getUserByUsername(username);

        Membership existingMembership = membershipRepository.findByUser(user)
                .orElseThrow(() -> new BusinessException("No membership found to renew", "NO_MEMBERSHIP"));

        if (!canRenew(existingMembership)) {
            throw new BusinessException(
                    "Cannot renew membership. It must be within " + RENEWAL_THRESHOLD_DAYS + " days of expiration.",
                    "CANNOT_RENEW");
        }

        if (paymentRepository.existsByUserAndTypeAndStatus(user, PaymentType.MEMBERSHIP, PaymentStatus.PENDING)) {
            throw new BusinessException("You have a pending payment. Please complete or cancel it first.",
                    "PENDING_PAYMENT_EXISTS");
        }

        MembershipType type = existingMembership.getType();
        if (type == null) {
            throw new BusinessException("Membership type not found", "MEMBERSHIP_TYPE_NOT_FOUND");
        }

        PaymentRequest paymentRequest = new PaymentRequest(
                PaymentType.MEMBERSHIP,
                type.getPrice(),
                null,
                type.getId());

        PaymentResponse paymentResponse = paymentProcessingService.createPayment(username, paymentRequest);

        paymentProcessingService.setRenewalDetailsForPayment(
                paymentResponse.id(),
                existingMembership.getId(),
                existingMembership.getEndDate());

        log.info("User {} initiated renewal for membership: {}", username, existingMembership.getId());
        return paymentResponse;
    }

    /**
     * Activate membership after successful payment
     */
    @Transactional
    public void activateMembership(User user, MembershipType type) {
        Membership existing = membershipRepository.findByUser(user).orElse(null);

        if (existing != null && existing.getEndDate() != null && existing.getEndDate().after(new Date())) {
            Calendar cal = Calendar.getInstance();
            cal.setTime(existing.getEndDate());
            cal.add(Calendar.YEAR, MEMBERSHIP_DURATION_YEARS);
            existing.setEndDate(cal.getTime());
            existing.setUserStatus(UserStatus.ACTIVE);
            membershipRepository.save(existing);
            log.info("Renewed membership for user: {}", user.getUsername());
        } else {
            if (existing != null) {
                membershipRepository.deleteByUser(user);
            }

            Calendar cal = Calendar.getInstance();
            cal.setTime(new Date());
            cal.add(Calendar.YEAR, MEMBERSHIP_DURATION_YEARS);

            Membership newMembership = Membership.builder()
                    .user(user)
                    .type(type)
                    .startDate(new Date())
                    .endDate(cal.getTime())
                    .userStatus(UserStatus.ACTIVE)
                    .build();

            membershipRepository.save(newMembership);
            log.info("Activated new membership for user: {}", user.getUsername());
        }

        notificationService.sendMembershipActivationNotification(user);
    }

    /**
     * Renew membership after payment
     */
    @Transactional
    public void renewMembershipAfterPayment(Long membershipId, Date currentEndDate) {
        Membership membership = membershipRepository.findById(membershipId)
                .orElseThrow(() -> new BusinessException("Membership not found", "MEMBERSHIP_NOT_FOUND"));

        Date now = new Date();

        Date startDate = (currentEndDate != null && currentEndDate.after(now))
                ? currentEndDate
                : now;

        Calendar cal = Calendar.getInstance();
        cal.setTime(startDate);
        cal.add(Calendar.YEAR, MEMBERSHIP_DURATION_YEARS);

        membership.setStartDate(startDate);
        membership.setEndDate(cal.getTime());
        membership.setUserStatus(UserStatus.ACTIVE);

        membershipRepository.save(membership);

        notificationService.sendMembershipRenewalNotification(membership.getUser());

        log.info("Renewed membership {} for user {}", membershipId, membership.getUser().getUsername());
    }

    /**
     * Process expired memberships
     */
    @Transactional
    public void processExpiredMemberships() {
        Date now = new Date();
        List<Membership> expiredMemberships = membershipRepository.findByEndDateBefore(now);

        for (Membership membership : expiredMemberships) {
            User user = membership.getUser();
            membershipRepository.delete(membership);
            log.info("Deleted expired membership for user: {}", user.getUsername());
        }
    }

    /**
     * Process memberships expiring in 3 days (send notifications)
     */
    @Transactional
    public void processExpiringSoonMemberships() {
        Date now = new Date();
        Calendar cal = Calendar.getInstance();
        cal.setTime(now);
        cal.add(Calendar.DAY_OF_MONTH, RENEWAL_THRESHOLD_DAYS);

        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        Date startOfDay = cal.getTime();

        cal.set(Calendar.HOUR_OF_DAY, 23);
        cal.set(Calendar.MINUTE, 59);
        cal.set(Calendar.SECOND, 59);
        cal.set(Calendar.MILLISECOND, 999);
        Date endOfDay = cal.getTime();

        List<Membership> expiringMemberships = membershipRepository.findByEndDateBetween(startOfDay, endOfDay);

        for (Membership membership : expiringMemberships) {
            notificationService.sendMembershipExpiringNotification(membership.getUser(), RENEWAL_THRESHOLD_DAYS);
            log.info("Sent expiring notification for user: {}", membership.getUser().getUsername());
        }
    }

    /**
     * Check if membership can be renewed
     */
    public boolean canRenew(Membership membership) {
        if (membership == null) {
            return false;
        }

        Date now = new Date();
        Date endDate = membership.getEndDate();

        if (endDate == null) {
            return false;
        }

        if (endDate.before(now)) {
            return true;
        }

        long diffInMillis = endDate.getTime() - now.getTime();
        long daysRemaining = TimeUnit.DAYS.convert(diffInMillis, TimeUnit.MILLISECONDS);

        return daysRemaining <= RENEWAL_THRESHOLD_DAYS;
    }

    /**
     * Get membership type by ID
     */
    public MembershipType getMembershipTypeById(Long id) {
        return membershipTypeRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Membership type not found", "MEMBERSHIP_TYPE_NOT_FOUND"));
    }

    private MembershipTypeResponse toMembershipTypeResponse(MembershipType type) {
        return new MembershipTypeResponse(
                type.getId(),
                type.getName(),
                type.getPrice(),
                type.getBorrowLimit(),
                type.getBorrowDurationDay(),
                type.getDescription(),
                type.getUserStatus());
    }

    private MembershipResponse toMembershipResponse(Membership membership) {
        Date now = new Date();
        Date endDate = membership.getEndDate();

        Long daysRemaining = null;
        Boolean isExpired = false;
        Boolean canRenew = false;

        if (endDate != null) {
            long diffInMillis = endDate.getTime() - now.getTime();
            daysRemaining = TimeUnit.DAYS.convert(diffInMillis, TimeUnit.MILLISECONDS);
            isExpired = daysRemaining < 0;
        }

        canRenew = canRenew(membership);

        return new MembershipResponse(
                membership.getId(),
                membership.getUser().getUsername(),
                membership.getType() != null ? membership.getType().getName() : null,
                membership.getType() != null ? membership.getType().getPrice() : null,
                membership.getType() != null ? membership.getType().getBorrowLimit() : null,
                membership.getType() != null ? membership.getType().getBorrowDurationDay() : null,
                membership.getStartDate(),
                membership.getEndDate(),
                daysRemaining,
                membership.getUserStatus(),
                isExpired,
                canRenew);
    }

    Membership getMembershipByUser(User user) {
        return membershipRepository.findByUser(user).orElse(null);
    }
}