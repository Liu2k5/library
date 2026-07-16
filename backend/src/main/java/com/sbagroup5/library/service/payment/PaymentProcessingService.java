package com.sbagroup5.library.service.payment;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

import com.sbagroup5.library.entity.payment.Bill;
import com.sbagroup5.library.entity.payment.BillStatus;
import com.sbagroup5.library.entity.payment.Payment;
import com.sbagroup5.library.entity.payment.PaymentStatus;
import com.sbagroup5.library.entity.payment.PaymentType;
import com.sbagroup5.library.entity.user.Membership;
import com.sbagroup5.library.entity.user.MembershipType;
import com.sbagroup5.library.entity.user.User;
import com.sbagroup5.library.entity.user.UserStatus;
import com.sbagroup5.library.exception.BusinessException;
import com.sbagroup5.library.record.payment.BillResponse;
import com.sbagroup5.library.record.payment.PaymentRequest;
import com.sbagroup5.library.record.payment.PaymentResponse;
import com.sbagroup5.library.repository.book.borrow.FineRepository;
import com.sbagroup5.library.repository.payment.BillRepository;
import com.sbagroup5.library.repository.payment.PaymentRepository;
import com.sbagroup5.library.repository.user.MembershipRepository;
import com.sbagroup5.library.repository.user.MembershipTypeRepository;
import com.sbagroup5.library.repository.user.UserRepository;
import com.sbagroup5.library.service.EmailService;
import com.sbagroup5.library.service.notification.NotificationService;
import com.sbagroup5.library.service.user.MembershipService;

import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.extern.slf4j.Slf4j;
import vn.payos.PayOS;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkRequest;

@Service
@Slf4j
public class PaymentProcessingService {

    private final PaymentRepository paymentRepository;
    private final BillRepository billRepository;
    private final FineRepository fineRepository;
    private final UserRepository userRepository;
    private final MembershipRepository membershipRepository;
    private final MembershipTypeRepository membershipTypeRepository;
    private final PayOS payOS;
    private final EmailService emailService;
    private final NotificationService notificationService;

    // Use setter injection with @Lazy to break circular dependency
    private MembershipService membershipService;

    public PaymentProcessingService(
            PaymentRepository paymentRepository,
            BillRepository billRepository,
            FineRepository fineRepository,
            UserRepository userRepository,
            MembershipRepository membershipRepository,
            MembershipTypeRepository membershipTypeRepository,
            PayOS payOS,
            EmailService emailService,
            NotificationService notificationService,
            @Lazy MembershipService membershipService) {
        this.paymentRepository = paymentRepository;
        this.billRepository = billRepository;
        this.fineRepository = fineRepository;
        this.userRepository = userRepository;
        this.membershipRepository = membershipRepository;
        this.membershipTypeRepository = membershipTypeRepository;
        this.payOS = payOS;
        this.emailService = emailService;
        this.notificationService = notificationService;
        this.membershipService = membershipService;
    }

    // Temporary storage for membership type ID during payment creation
    private final Map<Long, Long> paymentMembershipTypeMap = new HashMap<>();
    // Temporary storage for renewal details
    private final Map<Long, RenewalDetails> paymentRenewalMap = new HashMap<>();

    @Transactional
    public PaymentResponse createPayment(String username, PaymentRequest request) {
        User user = userRepository.findById(username)
                .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "User not found"));

        // For membership payments, validate business rules
        if (request.type() == PaymentType.MEMBERSHIP) {
            validateMembershipPayment(user, request);
        }

        // For fine payments, validate fine exists
        if (request.type() == PaymentType.FINE && request.fineId() != null) {
            if (!fineRepository.existsById(request.fineId())) {
                throw new BusinessException("FINE_NOT_FOUND", "Fine not found");
            }
        }

        long orderCode = generateOrderCode();
        Payment payment = Payment.builder()
                .id(orderCode)
                .user(user)
                .amount(request.amount())
                .type(request.type())
                .method("PayOS")
                .date(new Date())
                .status(PaymentStatus.PENDING)
                .build();

        paymentRepository.save(payment);

        // Store membership type ID for later use
        if (request.type() == PaymentType.MEMBERSHIP && request.membershipTypeId() != null) {
            paymentMembershipTypeMap.put(orderCode, request.membershipTypeId());
        }

        String checkoutUrl = createPayOSPaymentLink(orderCode, request.amount());
        payment.setPaymentUrl(checkoutUrl);
        paymentRepository.save(payment);

        log.info("Created payment {} for user {} with amount {}", orderCode, username, request.amount());

        return new PaymentResponse(
                payment.getId(),
                username,
                payment.getAmount(),
                payment.getType(),
                payment.getStatus(),
                payment.getMethod(),
                payment.getDate(),
                checkoutUrl,
                "Please complete payment via PayOS");
    }

    private void validateMembershipPayment(User user, PaymentRequest request) {
        // Check if user already has a pending payment
        if (paymentRepository.existsByUserAndTypeAndStatus(user, PaymentType.MEMBERSHIP, PaymentStatus.PENDING)) {
            throw new BusinessException("PENDING_PAYMENT_EXISTS",
                    "You have a pending payment. Please complete or cancel it first.");
        }

        // Check if user has membership
        Membership existingMembership = membershipRepository.findByUser(user).orElse(null);

        if (existingMembership != null) {
            // If user has membership, check if can renew
            if (!membershipService.canRenew(existingMembership)) {
                throw new BusinessException("CANNOT_RENEW",
                        "Cannot renew membership. It must be within 3 days of expiration.");
            }
        }
    }

    private String createPayOSPaymentLink(Long orderCode, Long amount) {
        try {
            CreatePaymentLinkRequest paymentData = CreatePaymentLinkRequest.builder()
                    .orderCode(orderCode)
                    .amount(amount)
                    .expiredAt(LocalDateTime.now().plusMinutes(15)
                            .atZone(ZoneId.systemDefault()).toEpochSecond())
                    .description("THANHTOAN" + orderCode)
                    .returnUrl("http://localhost:3000/payment/success?orderCode=" + orderCode)
                    .cancelUrl("http://localhost:3000/payment/cancel?orderCode=" + orderCode)
                    .build();

            return payOS.paymentRequests().create(paymentData).getCheckoutUrl();

        } catch (Exception e) {
            log.error("Error creating PayOS payment link: {}", e.getMessage(), e);
            throw new BusinessException("PAYOS_ERROR", "Cannot create payment link: " + e.getMessage());
        }
    }

    @Transactional
    public void handleWebhook(Long paymentId, String transactionCode) {
        log.info("Processing webhook for payment: {}", paymentId);

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> {
                    log.error("Payment not found: {}", paymentId);
                    return new BusinessException("PAYMENT_NOT_FOUND", "Payment not found");
                });

        log.info("Payment found: id={}, status={}, type={}", payment.getId(), payment.getStatus(), payment.getType());

        if (payment.getStatus() == PaymentStatus.COMPLETED) {
            log.warn("Payment {} already completed, skipping", paymentId);
            return;
        }

        payment.setStatus(PaymentStatus.COMPLETED);
        paymentRepository.save(payment);
        log.info("Payment {} status updated to COMPLETED", paymentId);

        Bill bill = Bill.builder()
                .payment(payment)
                .gatewayName("PayOS")
                .transactionCode(transactionCode)
                .status(BillStatus.COMPLETED)
                .createdAt(new Date())
                .build();
        billRepository.save(bill);
        log.info("Bill created for payment: {}", paymentId);

        processPostPayment(payment);

        log.info("Webhook processed for payment {} successfully", paymentId);
    }

    private void processPostPayment(Payment payment) {
        log.info("Processing post-payment for payment: {}, type: {}", payment.getId(), payment.getType());

        User user = payment.getUser();

        if (payment.getType() == PaymentType.MEMBERSHIP) {
            processMembershipPayment(payment);
        } else if (payment.getType() == PaymentType.FINE) {
            processFinePayment(payment);
        }

        // Send confirmation email
        sendPaymentConfirmationEmail(user, payment);
    }

    private void processMembershipPayment(Payment payment) {
        User user = payment.getUser();
        Long paymentId = payment.getId();

        log.info("Processing membership payment for user: {}", user.getUsername());

        // Kiểm tra renewal trước
        RenewalDetails renewalDetails = paymentRenewalMap.remove(paymentId);

        if (renewalDetails != null && renewalDetails.membershipId != null) {
            // Đây là renewal
            log.info("Processing RENEWAL for membership: {}", renewalDetails.membershipId);
            try {
                membershipService.renewMembershipAfterPayment(renewalDetails.membershipId,
                        renewalDetails.currentEndDate);
                notificationService.sendMembershipRenewalNotification(user);
                log.info("Membership renewed for user: {}", user.getUsername());
            } catch (Exception e) {
                log.error("Error renewing membership: {}", e.getMessage(), e);
                throw new BusinessException("RENEWAL_ERROR", "Failed to renew membership: " + e.getMessage());
            }
            return;
        }

        // Kiểm tra membership type từ map
        Long membershipTypeId = paymentMembershipTypeMap.remove(paymentId);

        if (membershipTypeId != null) {
            // Đây là đăng ký mới
            log.info("Processing NEW membership registration, typeId: {}", membershipTypeId);
            try {
                MembershipType type = membershipService.getMembershipTypeById(membershipTypeId);
                membershipService.activateMembership(user, type);
                notificationService.sendMembershipActivationNotification(user);
                log.info("New membership activated for user: {}", user.getUsername());
            } catch (Exception e) {
                log.error("Error activating membership: {}", e.getMessage(), e);
                throw new BusinessException("ACTIVATION_ERROR", "Failed to activate membership: " + e.getMessage());
            }
            return;
        }

        // Fallback
        log.warn("No membership type or renewal info found, using fallback");
        Membership existing = membershipRepository.findByUser(user).orElse(null);
        if (existing != null) {
            try {
                membershipService.renewMembershipAfterPayment(existing.getId(), existing.getEndDate());
                notificationService.sendMembershipRenewalNotification(user);
                log.info("Membership renewed (fallback) for user: {}", user.getUsername());
            } catch (Exception e) {
                log.error("Error renewing membership (fallback): {}", e.getMessage(), e);
                createDefaultMembership(user);
            }
        } else {
            createDefaultMembership(user);
        }
    }

    private void createDefaultMembership(User user) {
        try {
            MembershipType defaultType = membershipTypeRepository.findByName("Premium");
            if (defaultType == null) {
                defaultType = MembershipType.builder()
                        .name("Premium")
                        .price(100000L)
                        .borrowLimit(5)
                        .borrowDurationDay(14)
                        .description("Premium default package")
                        .userStatus(UserStatus.ACTIVE)
                        .build();
                membershipTypeRepository.save(defaultType);
            }
            membershipService.activateMembership(user, defaultType);
            notificationService.sendMembershipActivationNotification(user);
            log.info("Default membership created for user: {}", user.getUsername());
        } catch (Exception e) {
            log.error("Error creating default membership: {}", e.getMessage(), e);
        }
    }

    private void processFinePayment(Payment payment) {
        // Update fine status to PAID
        // This would need fineId mapping - implement based on requirements
        log.info("Fine payment processed for user: {}", payment.getUser().getUsername());
    }

    private void sendPaymentConfirmationEmail(User user, Payment payment) {
        try {
            String subject = "Payment Confirmation - Transaction: " + payment.getId();
            String body = "Payment Confirmation\n\n" +
                    "Dear " + user.getUsername() + ",\n\n" +
                    "We have received your payment successfully.\n\n" +
                    "Transaction ID: " + payment.getId() + "\n" +
                    "Amount: " + payment.getAmount() + " VND\n" +
                    "Payment Type: " + payment.getType() + "\n" +
                    "Date: " + payment.getDate() + "\n\n" +
                    "Thank you for using our service!\n\n" +
                    "Best regards,\n" +
                    "Library Management Team";

            emailService.sendSimpleEmail(user.getEmail(), subject, body);
            log.info("Payment confirmation email sent to: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send payment confirmation email to {}: {}", user.getEmail(), e.getMessage());
        }
    }

    // Helper methods for storing payment metadata
    public void setMembershipTypeIdForPayment(Long paymentId, Long membershipTypeId) {
        paymentMembershipTypeMap.put(paymentId, membershipTypeId);
    }

    public void setRenewalDetailsForPayment(Long paymentId, Long membershipId, Date currentEndDate) {
        paymentRenewalMap.put(paymentId, new RenewalDetails(membershipId, currentEndDate));
    }

    public PaymentResponse getPaymentInfo(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new BusinessException("PAYMENT_NOT_FOUND", "Payment not found"));

        return toPaymentResponse(payment);
    }

    public Page<PaymentResponse> getUserPayments(String username, Pageable pageable) {
        User user = userRepository.findById(username)
                .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "User not found"));

        Page<Payment> payments = paymentRepository.findByUser(user, pageable);
        return payments.map(this::toPaymentResponse);
    }

    public BillResponse getBillByPaymentId(Long paymentId) {
        Bill bill = billRepository.findByPaymentId(paymentId)
                .orElseThrow(() -> new BusinessException("BILL_NOT_FOUND", "Bill not found for this payment"));

        return new BillResponse(
                bill.getId(),
                bill.getPayment().getId(),
                bill.getGatewayName(),
                bill.getTransactionCode(),
                bill.getStatus(),
                bill.getCreatedAt());
    }

    @Transactional
    public PaymentResponse cancelPayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new BusinessException("PAYMENT_NOT_FOUND", "Payment not found"));

        if (payment.getStatus() != PaymentStatus.PENDING) {
            throw new BusinessException("INVALID_STATUS", "Only pending payments can be cancelled");
        }

        payment.setStatus(PaymentStatus.FAILED);
        paymentRepository.save(payment);

        // Remove from maps if exists
        paymentMembershipTypeMap.remove(paymentId);
        paymentRenewalMap.remove(paymentId);

        log.info("Cancelled payment: {}", paymentId);

        return new PaymentResponse(
                payment.getId(),
                payment.getUser().getUsername(),
                payment.getAmount(),
                payment.getType(),
                payment.getStatus(),
                payment.getMethod(),
                payment.getDate(),
                null,
                "Payment cancelled successfully");
    }

    private PaymentResponse toPaymentResponse(Payment payment) {
        return new PaymentResponse(
                payment.getId(),
                payment.getUser().getUsername(),
                payment.getAmount(),
                payment.getType(),
                payment.getStatus(),
                payment.getMethod(),
                payment.getDate(),
                payment.getPaymentUrl(),
                null);
    }

    private long generateOrderCode() {
        long code;
        do {
            code = ThreadLocalRandom.current().nextLong(100_000L, 9_999_999_999L);
        } while (paymentRepository.findById(code).isPresent());
        return code;
    }

    // Inner class for renewal details
    private static class RenewalDetails {
        Long membershipId;
        Date currentEndDate;

        RenewalDetails(Long membershipId, Date currentEndDate) {
            this.membershipId = membershipId;
            this.currentEndDate = currentEndDate;
        }
    }
}