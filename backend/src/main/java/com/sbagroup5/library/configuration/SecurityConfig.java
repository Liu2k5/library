package com.sbagroup5.library.configuration;

import java.io.IOException;
import java.util.Collections;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.intercept.AuthorizationFilter;
import org.springframework.web.filter.OncePerRequestFilter;

import com.sbagroup5.library.entity.user.User;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.ALWAYS))
            .addFilterBefore(sessionAuthenticationFilter(), AuthorizationFilter.class)
            .authorizeHttpRequests(authorize -> authorize
                // Static resources và error pages - public
                .requestMatchers("/css/**", "/js/**", "/images/**", "/error/**").permitAll()

                // Public URLs - không cần đăng nhập
                .requestMatchers("/").permitAll()
                
                // Admin URLs - chỉ Admin
                .requestMatchers("/admin/**").hasAnyRole("ADMIN")
                
                // Librarian URLs - chỉ Librarian, Admin
                .requestMatchers("/librarian/**").hasAnyRole("LIBRARIAN","ADMIN")
            
                // API requests - public (test, lúc review có thể xóa)
                .requestMatchers("/api/**").permitAll()

                // Mặc định - public
                .anyRequest().permitAll()
            )
            .exceptionHandling(exception -> exception
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    response.sendRedirect("/login?error=access_denied");
                })
            );

        return http.build();
    }

    /**
     * Filter để đưa user từ session vào Spring Security context
     * Để có thể sử dụng hasRole() trong authorizeHttpRequests()
     */
    @Bean
    public OncePerRequestFilter sessionAuthenticationFilter() {
        return new OncePerRequestFilter() {
            @Override
            protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
                    throws ServletException, IOException {
                
                HttpSession session = request.getSession(false);
                
                if (session != null) {
                    User user = (User) session.getAttribute("user");
                    String role = (String) session.getAttribute("role");
                    
                    if (user != null && role != null) {

                        String springSecurityRole = convertRoleToSpringSecurityRole(role);
                        
                        // Tạo authentication object và đưa vào SecurityContext
                        UsernamePasswordAuthenticationToken authentication = 
                            new UsernamePasswordAuthenticationToken(
                                user.getUsername(),
                                null,
                                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + springSecurityRole))
                            );
                        
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }
                }
                
                chain.doFilter(request, response);
            }
            
            private String convertRoleToSpringSecurityRole(String role) {
                return role.toUpperCase().replace(" ", "_");
            }
        };
    }
}