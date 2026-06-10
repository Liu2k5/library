package com.sbagroup5.library.repository.user;

import com.sbagroup5.library.entity.user.MembershipType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MembershipTypeRepository extends JpaRepository<MembershipType, Long> {
    MembershipType findByName(String name);
}
