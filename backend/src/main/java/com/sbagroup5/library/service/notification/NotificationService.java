package com.sbagroup5.library.service.notification;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import com.sbagroup5.library.entity.notification.Notification;
import com.sbagroup5.library.entity.notification.NotificationType;
import com.sbagroup5.library.entity.user.User;
import com.sbagroup5.library.repository.notification.NotificationRepository;
import com.sbagroup5.library.service.EmailService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final EmailService emailService;

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    public Optional<Notification> getNotificationById(Long id) {
        return notificationRepository.findById(id);
    }

    public Notification updateNotification(Long id, Notification notificationDetails) {
        Notification notification = notificationRepository.findById(id).orElse(null);
        if (notification != null) {
            notification.setTitle(notificationDetails.getTitle());
            notification.setMessage(notificationDetails.getMessage());
            notification.setType(notificationDetails.getType());

            return notificationRepository.save(notification);
        }
        return null;
    }

    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }

    @Transactional
    public void sendMembershipActivationNotification(User user) {
        String title = "Membership Activated";
        String message = String.format(
                "Your membership has been successfully activated! You can now borrow books up to your membership limit.",
                user.getFullName());

        createNotification(user, title, message, NotificationType.SUCCESS);
        sendEmail(user, title, message);
    }

    @Transactional
    public void sendMembershipRenewalNotification(User user) {
        String title = "Membership Renewed";
        String message = String.format(
                "Your membership has been successfully renewed! Your borrowing privileges have been extended.",
                user.getFullName());

        createNotification(user, title, message, NotificationType.SUCCESS);
        sendEmail(user, title, message);
    }

    @Transactional
    public void sendMembershipExpiringNotification(User user, int daysRemaining) {
        String title = "Membership Expiring Soon";
        String message = String.format(
                "Your membership will expire in %d days. Please renew to continue using library services.",
                daysRemaining);

        createNotification(user, title, message, NotificationType.SUCCESS);
        sendEmail(user, title, message);
    }

    @Transactional
    public void sendPaymentSuccessNotification(User user, Long paymentId) {
        String title = "Payment Successful";
        String message = String.format(
                "Your payment (ID: %d) has been successfully processed.",
                paymentId);

        createNotification(user, title, message, NotificationType.SUCCESS);
        sendEmail(user, title, message);
    }

    private void createNotification(User user, String title, String message, NotificationType type) {
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .createdAt(new Date())
                .isRead(false)
                .build();

        notificationRepository.save(notification);
        log.info("Created notification for user: {} - {}", user.getUsername(), title);
    }

    private void sendEmail(User user, String subject, String body) {
        try {
            emailService.sendEmail(user.getEmail(), subject, body);
            log.info("Sent email to: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", user.getEmail(), e.getMessage());
        }
    }
}
