package com.sbagroup5.library.repository.user;

import com.sbagroup5.library.entity.user.Membership;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MembershipRepository extends JpaRepository<Membership, Long> {
}
