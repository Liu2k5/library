package com.sbagroup5.library.repository.user;

import java.util.Optional;

import com.sbagroup5.library.entity.user.Role;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(String name);
}
