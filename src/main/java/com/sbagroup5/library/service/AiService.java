package com.sbagroup5.library.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.sbagroup5.library.record.AiMessage;
import com.sbagroup5.library.tool.CustomerTool;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.client.advisor.vectorstore.QuestionAnswerAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.memory.MessageWindowChatMemory;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;
import io.pinecone.clients.Index;

@Service
@Slf4j
public class AiService {

//    private final CustomerService customerService;
    private final VectorStore vectorStore;
    private final Index pineconeIndex;
    private final ChatClient chatClient;
    private final ChatMemory chatMemory =
            MessageWindowChatMemory.builder()
                    .maxMessages(36)
                    .build();
    private final ChatModel chatModel;
    private final CustomerTool customerTool;

    public AiService(
            @Qualifier("googleGenAiChatModel") ChatModel chatModel,
            VectorStore vectorStore,
            Index pineconeIndex,
//            CustomerService customerService,
            CustomerTool customerTool)
    {
//        this.customerService = customerService;
        this.vectorStore = vectorStore;
        this.pineconeIndex = pineconeIndex;
        this.chatModel = chatModel;
        this.customerTool = customerTool;

        this.chatClient = ChatClient.builder(chatModel)
                .defaultSystem(systemPrompt)
                .defaultAdvisors(
                        MessageChatMemoryAdvisor.builder(chatMemory).build(),
                        QuestionAnswerAdvisor.builder(vectorStore).build()
                )
                .build();

    }

    private final static String systemPrompt = """
            mo ta cong viec a.i can lam
            """;

    public void ask(String conversationId, String question, List<AiMessage> conversation) {
        if (question == null || question.isBlank()) {
            throw new RuntimeException("Cau hoi khong duoc de trong");
        } else if (question.length() > 255) {
            throw new RuntimeException("Cau hoi qua dai");
        }
        if (conversation == null) {
            conversation = new ArrayList<>();
        }
        String answer;
        try {
            answer = chatClient
                    .prompt(question)
                    .tools(customerTool)
                    .advisors(a -> a.param(ChatMemory.CONVERSATION_ID, conversationId))
                    .call()
                    .content();
        } catch (Exception ex) {
            String rootMessage = getRootMessage(ex);
            log.error("Gemini call failed: {}", rootMessage, ex);
            throw new RuntimeException("Gemini call failed: " + rootMessage, ex);
        }
        conversation.add(new AiMessage("user", question));
        conversation.add(new AiMessage("assistant", answer));
    }

    private static String getRootMessage(Throwable throwable) {
        Throwable current = throwable;
        Throwable last = throwable;
        while (current != null) {
            last = current;
            current = current.getCause();
        }
        String message = last.getMessage();
        return (message == null || message.isBlank()) ? last.getClass().getSimpleName() : message;
    }

    public void loadDataToVectorDb() {
        pineconeIndex.deleteAll("__default__");
        vectorStore.add(
                List.of(
                        new Document("""
                        Tiêu ngữ nhà nước cộng hòa xã hội chủ nghĩa Việt Nam là:
                        Độc lập - Tự do - Hạnh phúc.
                        """)
                )
        );
    }
}