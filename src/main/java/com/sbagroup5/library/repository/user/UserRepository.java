package com.sbagroup5.library.repository.user;

import com.sbagroup5.library.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {
     User findByEmail(String email);
}
