package com.sbagroup5.library.entity.book.borrow;

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
public class Fine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(name = "borrow_detail_id")
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private BorrowDetail borrowDetail;

    private Long amount;

    @Column(columnDefinition = "NVARCHAR(255)")
    private String reason;

    private Date issuedDate;

    private FineStatus status;
}
