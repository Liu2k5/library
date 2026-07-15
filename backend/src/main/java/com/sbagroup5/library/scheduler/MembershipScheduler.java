package com.sbagroup5.library.scheduler;

import com.sbagroup5.library.service.user.MembershipService;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class MembershipScheduler {

    private final MembershipService membershipService;

    /**
     * Run daily at midnight to process expired and expiring memberships
     */
    @Scheduled(cron = "0 0 0 * * ?") // At 00:00:00 every day
    public void processMemberships() {
        log.info("Starting membership processing...");

        try {
            // Process memberships expiring in 3 days
            membershipService.processExpiringSoonMemberships();
            log.info("Processed expiring soon memberships");

            // Process expired memberships
            membershipService.processExpiredMemberships();
            log.info("Processed expired memberships");

            log.info("Membership processing completed successfully");
        } catch (Exception e) {
            log.error("Error processing memberships: {}", e.getMessage(), e);
        }
    }
}