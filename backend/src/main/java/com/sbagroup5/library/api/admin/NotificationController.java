package com.sbagroup5.library.api.admin;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sbagroup5.library.entity.notification.Notification;
import com.sbagroup5.library.service.notification.NotificationService;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class NotificationController {
    @Autowired
    private NotificationService notificationService;
    @GetMapping
    public List<Notification> getAll(){
        return notificationService.getAllNotifications();
    }
    @GetMapping("/{id}")
    public ResponseEntity<Notification> getById(@PathVariable Long id){
        return notificationService.getNotificationById(id).map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping
    public Notification create(@RequestBody Notification notification){
        return notificationService.createNotification(notification);
    }
    @PutMapping("/{id}")
    public ResponseEntity<Notification> update(@PathVariable Long id, @RequestBody Notification n){
        Notification updated = notificationService.updateNotification(id, n);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        notificationService.deleteNotification(id);
        return ResponseEntity.ok().build();
    }
}
