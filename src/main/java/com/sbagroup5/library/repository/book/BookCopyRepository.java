package com.sbagroup5.library.repository.book;

import com.sbagroup5.library.entity.book.BookCopy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookCopyRepository extends JpaRepository<BookCopy, Long> {
}
