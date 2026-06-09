package com.sbagroup5.library.entity.notification;

import com.sbagroup5.library.entity.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(name = "user_id")
    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    private String title;
    private String message;

    @JoinColumn(name = "type_id")
    @ManyToOne(fetch = FetchType.LAZY)
    private NotificationType type;

    private boolean isRead;
    private Date createdAt;
}
