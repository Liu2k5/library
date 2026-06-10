package com.sbagroup5.library.repository.book;

import com.sbagroup5.library.entity.book.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
}
