package com.sbagroup5.library.entity.user;

import java.util.Collection;
import java.util.Collections;
import java.util.Date;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import lombok.Data;
import lombok.experimental.SuperBuilder;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Table(name = "users")
public class User implements UserDetails {
    @Id
    private String username;

    @ManyToOne(fetch = FetchType.LAZY)
    private Role role;

    @Column(columnDefinition = "NVARCHAR(100)")
    private String fullName;

    @Column(columnDefinition = "VARCHAR(100)", unique = true)
    private String email;

    @Column(columnDefinition = "VARCHAR(64)")
    private String password;

    @Column(columnDefinition = "VARCHAR(20)")
    private String phone;

    @Column(columnDefinition = "NVARCHAR(255)")
    private String address;

    private UserStatus userStatus;

    private Date createdAt;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority(role.getName()));
    }

    @Override
    public @Nullable String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

}
