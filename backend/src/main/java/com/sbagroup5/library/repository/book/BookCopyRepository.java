package com.sbagroup5.library.repository.book;

import com.sbagroup5.library.entity.book.BookCopy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookCopyRepository extends JpaRepository<BookCopy, Long> {

    Page<BookCopy> findByBookId(Long bookId, Pageable pageable);

    boolean existsByBarcode(String barcode);

}
