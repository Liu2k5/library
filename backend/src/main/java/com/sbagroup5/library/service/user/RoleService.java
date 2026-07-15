package com.sbagroup5.library.service.user;

import java.util.Optional;

import com.sbagroup5.library.entity.user.Role;
import com.sbagroup5.library.repository.user.RoleRepository;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;

    public Optional<Role> findByName(String name) {
        return roleRepository.findByName(name);
    }
}
