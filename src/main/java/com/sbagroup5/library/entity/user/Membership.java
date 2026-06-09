package com.sbagroup5.library.entity.user;

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
public class Membership {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(name = "user_id")
    @OneToOne(cascade = CascadeType.ALL)
    private User user;

    @JoinColumn(name = "type_id")
    @ManyToOne(cascade = CascadeType.ALL)
    private MembershipType type;

    private Date startDate;
    private Date endDate;

    @JoinColumn(name = "status_id")
    @ManyToOne(cascade = CascadeType.ALL)
    private UserStatus userStatus;
}
