package com.sbagroup5.library.record.membership;

import java.util.Date;

import com.sbagroup5.library.entity.user.UserStatus;

public record MembershipResponse(
        Long id,
        String username,
        String typeName,
        Long price,
        Integer borrowLimit,
        Integer borrowDurationDay,
        Date startDate,
        Date endDate,
        Long daysRemaining,
        UserStatus status,
        Boolean isExpired,
        Boolean canRenew) {
}