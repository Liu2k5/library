package com.sbagroup5.library.repository.book;

import com.sbagroup5.library.entity.book.Author;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthorRepository extends JpaRepository<Author, Long> {
}
