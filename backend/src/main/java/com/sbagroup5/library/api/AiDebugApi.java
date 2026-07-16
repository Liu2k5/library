package com.sbagroup5.library.api;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * API debug để test trực tiếp Google GenAI SDK, bypass Spring AI.
 */
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiDebugApi {

    private final Client genAiClient;

    @PostMapping("/test-direct")
    public ResponseEntity<Map<String, Object>> testDirect(@RequestBody Map<String, String> request) {
        String question = request.getOrDefault("question", "Xin chào");
        try {
            // Gọi trực tiếp Google GenAI SDK
            GenerateContentResponse response = genAiClient.models.generateContent(
                    "gemini-3.1-flash-lite",
                    question,
                    null  // no config
            );

            String text = response.text();
            String finishReason = response.finishReason() != null
                    ? response.finishReason().toString()
                    : "(null)";

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "text", text != null ? text : "(null)",
                    "finishReason", finishReason
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                    "success", false,
                    "error", e.getClass().getName() + ": " + e.getMessage()
            ));
        }
    }
}
