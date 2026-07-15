package com.sbagroup5.library.repository.notification;

import com.sbagroup5.library.entity.notification.Notification;

import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

}
