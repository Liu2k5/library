package com.sbagroup5.library.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import com.sbagroup5.library.entity.book.Author;
import com.sbagroup5.library.entity.book.Book;
import com.sbagroup5.library.entity.book.BookCopy;
import com.sbagroup5.library.entity.book.Category;
import com.sbagroup5.library.entity.book.CopyStatus;
import com.sbagroup5.library.entity.user.MembershipType;
import com.sbagroup5.library.record.AiMessage;
import com.sbagroup5.library.repository.book.AuthorRepository;
import com.sbagroup5.library.repository.book.BookCopyRepository;
import com.sbagroup5.library.repository.book.BookRepository;
import com.sbagroup5.library.repository.book.CategoryRepository;
import com.sbagroup5.library.repository.user.MembershipTypeRepository;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AiService {

    private final Client genAiClient;
    private final BookRepository bookRepository;
    private final BookCopyRepository bookCopyRepository;
    private final AuthorRepository authorRepository;
    private final CategoryRepository categoryRepository;
    private final MembershipTypeRepository membershipTypeRepository;

    public AiService(
            Client genAiClient,
            BookRepository bookRepository,
            BookCopyRepository bookCopyRepository,
            AuthorRepository authorRepository,
            CategoryRepository categoryRepository,
            MembershipTypeRepository membershipTypeRepository)
    {
        this.genAiClient = genAiClient;
        this.bookRepository = bookRepository;
        this.bookCopyRepository = bookCopyRepository;
        this.authorRepository = authorRepository;
        this.categoryRepository = categoryRepository;
        this.membershipTypeRepository = membershipTypeRepository;
    }

    public void ask(String conversationId, String question, List<AiMessage> conversation) {
        if (question == null || question.isBlank()) {
            throw new RuntimeException("Cau hoi khong duoc de trong");
        } else if (question.length() > 255) {
            throw new RuntimeException("Cau hoi qua dai");
        }
        if (conversation == null) {
            conversation = new ArrayList<>();
        }

        // ===== TRUY VẤN DỮ LIỆU THỰC TỪ DATABASE =====
        String booksData = queryBooksData();
        String categoriesData = queryCategoriesData();
        String membershipData = queryMembershipData();

        // ===== XÂY DỰNG PROMPT =====
        StringBuilder fullPrompt = new StringBuilder();
        fullPrompt.append("Bạn là trợ lý ảo của thư viện. Bạn chỉ được trả lời DỰA TRÊN dữ liệu thư viện được cung cấp bên dưới. ")
                .append("TUYỆT ĐỐI KHÔNG ĐƯỢC bịa ra thông tin không có trong dữ liệu. ")
                .append("Nếu người dùng hỏi về sách, tác giả, thể loại không có trong danh sách, hãy nói là thư viện không có.\n\n");

        fullPrompt.append("===== DANH SÁCH SÁCH TRONG THƯ VIỆN =====\n");
        fullPrompt.append(booksData).append("\n");

        fullPrompt.append("===== DANH SÁCH THỂ LOẠI =====\n");
        fullPrompt.append(categoriesData).append("\n");

        fullPrompt.append("===== GÓI MEMBERSHIP =====\n");
        fullPrompt.append(membershipData).append("\n\n");

        fullPrompt.append("===== HƯỚNG DẪN =====").append("\n");
        fullPrompt.append("- Trả lời bằng tiếng Việt, thân thiện, dễ hiểu.\n");
        fullPrompt.append("- Chỉ sử dụng dữ liệu được cung cấp ở trên. KHÔNG bịa thêm thông tin.\n");
        fullPrompt.append("- Nếu dữ liệu không có thông tin người dùng hỏi, hãy trả lời 'Thư viện hiện chưa có thông tin này.'\n");
        fullPrompt.append("- Khi giới thiệu sách, nêu rõ: tên sách, tác giả, thể loại, giá, số bản có sẵn.\n\n");

        // Thêm lịch sử hội thoại
        if (!conversation.isEmpty()) {
            fullPrompt.append("Lịch sử hội thoại:\n");
            for (AiMessage msg : conversation) {
                String role = "user".equals(msg.author()) ? "Người dùng" : "Bạn";
                fullPrompt.append(role).append(": ").append(msg.content()).append("\n");
            }
            fullPrompt.append("\n");
        }

        fullPrompt.append("Người dùng: ").append(question).append("\n");
        fullPrompt.append("Bạn (chỉ dựa trên dữ liệu thư viện ở trên): ");

        // ===== GỌI GEMINI =====
        String answer;
        try {
            GenerateContentResponse response = genAiClient.models.generateContent(
                    "gemini-3.1-flash-lite",
                    fullPrompt.toString(),
                    null
            );
            answer = response.text();
            if (answer == null || answer.isBlank()) {
                answer = "Xin lỗi, tôi không thể trả lời câu hỏi này ngay bây giờ. Bạn có thể thử diễn đạt lại câu hỏi hoặc hỏi về chủ đề khác như sách, tác giả, thể loại, membership nhé!";
            }
        } catch (Exception ex) {
            log.error("Gemini call failed: {}", ex.getMessage(), ex);
            throw new RuntimeException("Gemini call failed: " + ex.getMessage(), ex);
        }

        conversation.add(new AiMessage("user", question));
        conversation.add(new AiMessage("assistant", answer));
    }

    private String queryBooksData() {
        List<Book> books = bookRepository.findAll();
        if (books.isEmpty()) return "Thư viện chưa có sách nào.\n";

        StringBuilder sb = new StringBuilder();
        for (Book b : books) {
            String authorName = b.getAuthor() != null ? b.getAuthor().getName() : "Đang cập nhật";
            String catName = b.getCategory() != null ? b.getCategory().getName() : "Đang cập nhật";

            List<BookCopy> copies = bookCopyRepository.findAll().stream()
                    .filter(c -> c.getBook().getId().equals(b.getId()))
                    .toList();
            long available = copies.stream()
                    .filter(c -> c.getStatus() == CopyStatus.AVAILABLE)
                    .count();
            // Gom các vị trí của bản có sẵn
            String locations = copies.stream()
                    .filter(c -> c.getStatus() == CopyStatus.AVAILABLE)
                    .map(c -> c.getLocation() != null ? c.getLocation() : "Chưa xác định")
                    .distinct()
                    .collect(java.util.stream.Collectors.joining(", "));

            sb.append("- ID: ").append(b.getId())
                    .append(" | Tên: \"").append(b.getTitle()).append("\"")
                    .append(" | Tác giả: ").append(authorName)
                    .append(" | Thể loại: ").append(catName);
            if (b.getIsbn() != null) sb.append(" | ISBN: ").append(b.getIsbn());
            if (b.getPublisher() != null) sb.append(" | NXB: ").append(b.getPublisher());
            if (b.getPublishYear() != null) sb.append(" | Năm: ").append(b.getPublishYear());
            if (b.getPrice() != null) sb.append(" | Giá: ").append(b.getPrice()).append("đ");
            if (b.getDescription() != null) sb.append(" | Mô tả: ").append(b.getDescription());
            sb.append(" | Có sẵn: ").append(available).append(" bản");
            if (!locations.isEmpty()) sb.append(" | Vị trí: ").append(locations);
            sb.append("\n");
        }
        return sb.toString();
    }

    private String queryCategoriesData() {
        List<Category> categories = categoryRepository.findAll();
        if (categories.isEmpty()) return "Chưa có thể loại nào.\n";
        StringBuilder sb = new StringBuilder();
        for (Category c : categories) {
            long count = bookRepository.findAll().stream()
                    .filter(b -> b.getCategory() != null && b.getCategory().getId().equals(c.getId()))
                    .count();
            sb.append("- ").append(c.getName())
                    .append(": ").append(c.getDescription() != null ? c.getDescription() : "")
                    .append(" (").append(count).append(" cuốn)\n");
        }
        return sb.toString();
    }

    private String queryMembershipData() {
        List<MembershipType> plans = membershipTypeRepository.findAll();
        if (plans.isEmpty()) return "Chưa có gói membership nào.\n";
        StringBuilder sb = new StringBuilder();
        for (MembershipType m : plans) {
            sb.append("- ").append(m.getName())
                    .append(" | Giá: ").append(m.getPrice()).append("đ")
                    .append(" | Mượn tối đa: ").append(m.getBorrowLimit()).append(" cuốn")
                    .append(" | Thời hạn: ").append(m.getBorrowDurationDay()).append(" ngày")
                    .append(" | Mô tả: ").append(m.getDescription() != null ? m.getDescription() : "")
                    .append("\n");
        }
        return sb.toString();
    }

    public void loadDataToVectorDb() {
        log.info("Use VectorDbDataService to load data.");
    }
}