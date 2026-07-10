package com.sbagroup5.library.entity.book.borrow;

import com.sbagroup5.library.entity.book.BookCopy;
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
public class BorrowDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(name = "borrow_id")
    @ManyToOne(fetch = FetchType.EAGER)
    private Borrow borrow;

    @JoinColumn(name = "copy_id")
    @ManyToOne(fetch = FetchType.EAGER)
    private BookCopy copy;

    private Date returnDate;
}
