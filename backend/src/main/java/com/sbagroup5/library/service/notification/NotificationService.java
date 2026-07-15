package com.sbagroup5.library.service.notification;

import com.sbagroup5.library.entity.notification.Notification;
import com.sbagroup5.library.entity.notification.NotificationType;
import com.sbagroup5.library.entity.user.User;
import com.sbagroup5.library.repository.notification.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    /**
     * Tạo và lưu một thông báo cho người dùng.
     */
    public Notification create(User user, String title, String message, NotificationType type) {
        return notificationRepository.save(Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .isRead(false)
                .createdAt(new Date())
                .build());
    }
}
