package com.sbagroup5.library.entity.user;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class MembershipType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "NVARCHAR(50)")
    private String name;
    private Long price;
    private Integer borrowLimit;
    private Integer borrowDurationDay;
    @Column(columnDefinition = "NVARCHAR(255)")
    private String description;

    private UserStatus userStatus;
}
