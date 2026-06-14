package com.sbagroup5.library.entity.payment;

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
public class Bill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(name = "payment_id")
    @OneToOne(fetch = FetchType.LAZY)
    private Payment payment;

    private String gatewayName;
    private String transactionCode;

    private BillStatus status;

    private Date createdAt;
}
