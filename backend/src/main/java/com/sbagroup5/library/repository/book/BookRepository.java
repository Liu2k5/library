package com.sbagroup5.library.repository.book;

import com.sbagroup5.library.entity.book.Book;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<Book, Long> {
}
