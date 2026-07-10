package com.sbagroup5.library.repository.book;

import com.sbagroup5.library.entity.book.BookCopy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BookCopyRepository extends JpaRepository<BookCopy, Long> {
    Optional<BookCopy> findByBarcode(String barcode);
}
