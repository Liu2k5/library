package com.sbagroup5.library.repository.book.borrow;

import com.sbagroup5.library.entity.book.borrow.Borrow;
import com.sbagroup5.library.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BorrowRepository extends JpaRepository<Borrow, Long> {
    List<Borrow> findByUserOrderByBorrowDateDesc(User user);
}
