package com.sbagroup5.library.repository.book;

import com.sbagroup5.library.entity.book.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
