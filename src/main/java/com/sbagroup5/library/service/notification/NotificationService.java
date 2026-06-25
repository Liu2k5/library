package com.sbagroup5.library.service.notification;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import com.sbagroup5.library.entity.notification.Notification;
import com.sbagroup5.library.repository.notification.NotificationRepository;

@Service
@RequiredArgsConstructor
public class NotificationService {
        @Autowired
        private NotificationRepository notificationRepository;

        public List<Notification> getAllNotifications() {
                return notificationRepository.findAll();
        }

        public Notification createNotification(Notification notification) {
                return notificationRepository.save(notification);
        }
        
        public Notification getNotificationById(Long id) {
                return notificationRepository.findById(id).orElse(null);
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
}
