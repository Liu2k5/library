package com.sbagroup5.library.api;

import com.sbagroup5.library.record.AiMessage;
import com.sbagroup5.library.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * API cho AI Chatbot - hỗ trợ tra cứu sách, thông tin thư viện.
 */
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiChatApi {

    private final AiService aiService;

    /**
     * POST /api/ai/chat
     * Gửi câu hỏi đến AI và nhận câu trả lời.
     * <p>
     * Request body:
     * { "question": "nội dung câu hỏi", "conversationId": "(optional)", "history": [...] }
     */
    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chat(@RequestBody Map<String, Object> request) {
        String question = (String) request.get("question");
        String conversationId = (String) request.get("conversationId");
        @SuppressWarnings("unchecked")
        List<Map<String, String>> historyRaw = (List<Map<String, String>>) request.get("history");

        System.out.println(">>> AI CHAT REQUEST: question=" + question);

        if (conversationId == null || conversationId.isBlank()) {
            conversationId = UUID.randomUUID().toString();
        }

        // Chuyển đổi history từ Map sang AiMessage
        List<AiMessage> conversation = new ArrayList<>();
        if (historyRaw != null) {
            for (Map<String, String> msg : historyRaw) {
                conversation.add(new AiMessage(msg.get("author"), msg.get("content")));
            }
        }

        try {
            aiService.ask(conversationId, question, conversation);
            System.out.println(">>> AI CHAT SUCCESS, conversation size=" + conversation.size());
        } catch (Exception e) {
            System.err.println(">>> AI CHAT ERROR: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }

        // Lấy tin nhắn cuối (câu trả lời của AI)
        String answer = "";
        if (!conversation.isEmpty()) {
            AiMessage last = conversation.get(conversation.size() - 1);
            System.out.println(">>> LAST MESSAGE: author=" + last.author() + " content='" + last.content() + "'");
            if ("assistant".equals(last.author())) {
                answer = last.content();
            }
        }
        if (answer == null || answer.isBlank()) {
            answer = "Xin lỗi, tôi không thể trả lời câu hỏi này ngay bây giờ. Bạn có thể thử hỏi về sách, tác giả, thể loại hoặc các dịch vụ thư viện nhé!";
        }

        System.out.println(">>> AI CHAT RESPONSE: answer='" + answer + "'");

        return ResponseEntity.ok(Map.of(
                "conversationId", conversationId,
                "answer", answer
        ));
    }
}
