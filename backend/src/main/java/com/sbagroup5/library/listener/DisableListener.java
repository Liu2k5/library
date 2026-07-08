package com.sbagroup5.library.listener;

import com.sbagroup5.library.record.DisableEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.session.FindByIndexNameSessionRepository;
import org.springframework.session.Session;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DisableListener {
    private final FindByIndexNameSessionRepository<? extends Session> sessionRepository;

    @EventListener
    public void onDisableEvent(DisableEvent event) {
        sessionRepository.findByPrincipalName(event.username()).values().forEach(session -> {
            sessionRepository.deleteById(session.getId());
        });
    }
}
