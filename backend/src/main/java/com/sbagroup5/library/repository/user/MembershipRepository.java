package com.sbagroup5.library.repository.user;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import com.sbagroup5.library.entity.user.Membership;
import com.sbagroup5.library.entity.user.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

public interface MembershipRepository extends JpaRepository<Membership, Long> {

    Optional<Membership> findByUser(User user);

    boolean existsByUser(User user);

    @Transactional
    void deleteByUser(User user);

    List<Membership> findByEndDateBefore(Date

    date);

    List<Membership> findByEndDateBetween(Date start, Date end);
}