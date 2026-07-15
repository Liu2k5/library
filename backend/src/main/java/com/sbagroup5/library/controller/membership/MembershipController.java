package com.sbagroup5.library.controller.membership;

import java.util.List;

import jakarta.validation.Valid;

import com.sbagroup5.library.record.membership.MembershipRequest;
import com.sbagroup5.library.record.membership.MembershipResponse;
import com.sbagroup5.library.record.membership.MembershipTypeResponse;
import com.sbagroup5.library.record.payment.PaymentResponse;
import com.sbagroup5.library.service.auth.AuthService;
import com.sbagroup5.library.service.user.MembershipService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/membership")
@RequiredArgsConstructor
public class MembershipController {

    private final MembershipService membershipService;
    private final AuthService authService;

    /**
     * Get all available membership types
     */
    @GetMapping("/types")
    public ResponseEntity<List<MembershipTypeResponse>> getMembershipTypes() {
        List<MembershipTypeResponse> types = membershipService.getAllMembershipTypes();
        return ResponseEntity.ok(types);
    }

    /**
     * Get current user's membership
     */
    @GetMapping("/current")
    public ResponseEntity<MembershipResponse> getCurrentMembership() {
        String username = authService.getCurrentUser().getUsername();
        MembershipResponse response = membershipService.getCurrentMembership(username);

        if (response == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(response);
    }

    /**
     * Register a new membership
     */
    @PostMapping("/register")
    public ResponseEntity<PaymentResponse> registerMembership(@Valid @RequestBody MembershipRequest request) {
        String username = authService.getCurrentUser().getUsername();
        PaymentResponse response = membershipService.registerMembership(username, request.membershipTypeId());
        return ResponseEntity.ok(response);
    }

    /**
     * Renew existing membership
     */
    @PostMapping("/renew")
    public ResponseEntity<PaymentResponse> renewMembership() {
        String username = authService.getCurrentUser().getUsername();
        PaymentResponse response = membershipService.renewMembership(username);
        return ResponseEntity.ok(response);
    }
}