package com.sbagroup5.library.repository.book;

import com.sbagroup5.library.entity.book.Author;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthorRepository extends JpaRepository<Author, Long> {

    Page<Author> findByNameContainingIgnoreCase(
            String keyword,
            Pageable pageable
    );

}
