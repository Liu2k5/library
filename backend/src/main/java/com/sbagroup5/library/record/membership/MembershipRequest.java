package com.sbagroup5.library.record.membership;

import jakarta.validation.constraints.NotNull;

public record MembershipRequest(
        @NotNull(message = "Membership type ID is required") Long membershipTypeId) {
}