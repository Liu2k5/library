package com.sbagroup5.library.service.user;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.sbagroup5.library.entity.user.Role;
import com.sbagroup5.library.entity.user.User;
import com.sbagroup5.library.repository.user.RoleRepository;
import com.sbagroup5.library.repository.user.UserRepository;

@Service
public class AccountService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findById(username);
    }

    public User createUser(User user) {

        Role role = roleRepository.findByName(user.getRole().getName())
                .orElseThrow(() -> new RuntimeException("Role not found"));

        user.setRole(role);

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        user.setCreatedAt(new Date());

        return userRepository.save(user);
    }

    public User updateUser(String username, User user) {
        return userRepository.findById(username)
                .map(existingUser -> {
                    // Admin chỉ được cập nhật trạng thái tài khoản
                    existingUser.setUserStatus(user.getUserStatus());

                    return userRepository.save(existingUser);
                })
                .orElse(null);
    }
}
