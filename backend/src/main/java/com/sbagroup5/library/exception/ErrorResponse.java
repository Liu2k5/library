package com.sbagroup5.library.exception;

import java.time.LocalDateTime;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ErrorResponse {
    private int status;
    private String errorCode;
    private String message;
    private Map<String, String> errors;
    private LocalDateTime timestamp;
}
