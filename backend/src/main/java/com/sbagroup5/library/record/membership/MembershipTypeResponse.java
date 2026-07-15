package com.sbagroup5.library.record.membership;

import com.sbagroup5.library.entity.user.UserStatus;

public record MembershipTypeResponse(
        Long id,
        String name,
        Long price,
        Integer borrowLimit,
        Integer borrowDurationDay,
        String description,
        UserStatus status) {
}