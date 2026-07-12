package com.sbagroup5.library.repository.user;

import com.sbagroup5.library.entity.user.Membership;
import com.sbagroup5.library.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MembershipRepository extends JpaRepository<Membership, Long> {
    Optional<Membership> findByUser(User user);
}
