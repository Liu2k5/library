package com.sbagroup5.library.record;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.Serializable;

public record DisableEvent(String username) implements Serializable {

}
