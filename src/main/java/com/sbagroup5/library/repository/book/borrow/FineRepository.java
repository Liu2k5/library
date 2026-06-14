package com.sbagroup5.library.repository.book.borrow;

import com.sbagroup5.library.entity.book.borrow.Fine;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FineRepository extends JpaRepository<Fine, Long> {
}
