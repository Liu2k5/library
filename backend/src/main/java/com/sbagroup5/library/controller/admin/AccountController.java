package com.sbagroup5.library.controller.admin;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sbagroup5.library.entity.user.User;
import com.sbagroup5.library.service.user.AccountService;

@RestController
@RequestMapping("/admin/accounts")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AccountController {
    @Autowired
    private AccountService accountService;

    @GetMapping
    public List<User> getAll() {
        return accountService.getAllUsers();
    }

    @GetMapping("/{username}")
    public ResponseEntity<User> getByUsername(@PathVariable String username) {
        return accountService.getUserByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public User create(@RequestBody User user) {
        return accountService.createUser(user);
    }

    @PutMapping("/{username}")
    public ResponseEntity<User> update(
            @PathVariable String username,
            @RequestBody User user) {

        User updated = accountService.updateUser(username, user);

        return updated != null
                ? ResponseEntity.ok(updated)
                : ResponseEntity.notFound().build();
    }
}
