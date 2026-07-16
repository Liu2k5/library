package com.sbagroup5.library.tool;

import com.sbagroup5.library.entity.book.Author;
import com.sbagroup5.library.entity.book.Book;
import com.sbagroup5.library.entity.book.BookCopy;
import com.sbagroup5.library.entity.book.BookStatus;
import com.sbagroup5.library.entity.book.Category;
import com.sbagroup5.library.entity.book.CopyStatus;
import com.sbagroup5.library.entity.book.borrow.Borrow;
import com.sbagroup5.library.entity.user.MembershipType;
import com.sbagroup5.library.repository.book.AuthorRepository;
import com.sbagroup5.library.repository.book.BookCopyRepository;
import com.sbagroup5.library.repository.book.BookRepository;
import com.sbagroup5.library.repository.book.CategoryRepository;
import com.sbagroup5.library.repository.book.borrow.BorrowRepository;
import com.sbagroup5.library.repository.user.MembershipTypeRepository;
import com.sbagroup5.library.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ReaderTool {

    private final BookRepository bookRepository;
    private final BookCopyRepository bookCopyRepository;
    private final AuthorRepository authorRepository;
    private final CategoryRepository categoryRepository;
    private final BorrowRepository borrowRepository;
    private final UserRepository userRepository;
    private final MembershipTypeRepository membershipTypeRepository;

    // ==================== SÁCH ====================

    @Tool(description = "Tìm kiếm sách theo từ khoá (tiêu đề, ISBN). Trả về danh sách sách phù hợp.")
    public String searchBooks(String keyword) {
        if (keyword == null || keyword.isBlank()) return "Vui lòng nhập từ khoá tìm kiếm.";
        List<Book> books = bookRepository.findAll().stream()
                .filter(b -> (b.getTitle() != null && b.getTitle().toLowerCase().contains(keyword.toLowerCase()))
                        || (b.getIsbn() != null && b.getIsbn().toLowerCase().contains(keyword.toLowerCase())))
                .limit(10)
                .toList();
        if (books.isEmpty()) return "Không tìm thấy sách nào với từ khoá: " + keyword;
        StringBuilder sb = new StringBuilder("Kết quả tìm kiếm cho \"" + keyword + "\":\n\n");
        for (int i = 0; i < books.size(); i++) {
            Book b = books.get(i);
            sb.append(i + 1).append(". ").append(b.getTitle())
                    .append(" - Tác giả: ").append(b.getAuthor() != null ? b.getAuthor().getName() : "Đang cập nhật")
                    .append(" - Thể loại: ").append(b.getCategory() != null ? b.getCategory().getName() : "Đang cập nhật")
                    .append("\n");
        }
        return sb.toString();
    }

    @Tool(description = "Lấy thông tin chi tiết của một cuốn sách theo ID.")
    public String getBookDetails(Long bookId) {
        Book book = bookRepository.findById(bookId).orElse(null);
        if (book == null) return "Không tìm thấy sách với ID: " + bookId;

        long availableCopies = bookCopyRepository.findAll().stream()
                .filter(c -> c.getBook().getId().equals(bookId) && c.getStatus() == CopyStatus.AVAILABLE)
                .count();

        return """
                📖 %s
                📝 Tác giả: %s
                🏷️ Thể loại: %s
                🔢 ISBN: %s
                🏢 Nhà xuất bản: %s
                📅 Năm xuất bản: %d
                💰 Giá: %d VND
                📄 Mô tả: %s
                📊 Trạng thái: %s
                📚 Số bản có sẵn: %d
                """.formatted(
                book.getTitle(),
                book.getAuthor() != null ? book.getAuthor().getName() : "Đang cập nhật",
                book.getCategory() != null ? book.getCategory().getName() : "Đang cập nhật",
                book.getIsbn() != null ? book.getIsbn() : "Đang cập nhật",
                book.getPublisher() != null ? book.getPublisher() : "Đang cập nhật",
                book.getPublishYear() != null ? book.getPublishYear() : 0,
                book.getPrice() != null ? book.getPrice() : 0,
                book.getDescription() != null ? book.getDescription() : "Chưa có mô tả",
                book.getStatus() != null ? book.getStatus().name() : "Đang cập nhật",
                availableCopies
        );
    }

    @Tool(description = "Tìm sách theo tên tác giả. Trả về danh sách các cuốn sách của tác giả đó.")
    public String getBooksByAuthor(String authorName) {
        if (authorName == null || authorName.isBlank()) return "Vui lòng nhập tên tác giả.";
        List<Book> books = bookRepository.findAll().stream()
                .filter(b -> b.getAuthor() != null
                        && b.getAuthor().getName().toLowerCase().contains(authorName.toLowerCase()))
                .limit(10)
                .toList();
        if (books.isEmpty()) return "Không tìm thấy sách của tác giả: " + authorName;
        StringBuilder sb = new StringBuilder("Sách của tác giả \"" + books.getFirst().getAuthor().getName() + "\":\n\n");
        for (int i = 0; i < books.size(); i++) {
            Book b = books.get(i);
            sb.append(i + 1).append(". ").append(b.getTitle())
                    .append(" (").append(b.getPublishYear() != null ? b.getPublishYear() : "??").append(")")
                    .append(" - ").append(b.getCategory() != null ? b.getCategory().getName() : "Đang cập nhật")
                    .append("\n");
        }
        return sb.toString();
    }

    @Tool(description = "Tìm sách theo tên thể loại. Trả về danh sách các cuốn sách thuộc thể loại đó.")
    public String getBooksByCategory(String categoryName) {
        if (categoryName == null || categoryName.isBlank()) return "Vui lòng nhập tên thể loại.";
        List<Book> books = bookRepository.findAll().stream()
                .filter(b -> b.getCategory() != null
                        && b.getCategory().getName().toLowerCase().contains(categoryName.toLowerCase()))
                .limit(15)
                .toList();
        if (books.isEmpty()) return "Không tìm thấy sách nào thuộc thể loại: " + categoryName;
        String catName = books.getFirst().getCategory().getName();
        StringBuilder sb = new StringBuilder("Sách thuộc thể loại \"" + catName + "\":\n\n");
        for (int i = 0; i < books.size(); i++) {
            Book b = books.get(i);
            sb.append(i + 1).append(". ").append(b.getTitle())
                    .append(" - ").append(b.getAuthor() != null ? b.getAuthor().getName() : "Đang cập nhật")
                    .append("\n");
        }
        return sb.toString();
    }

    @Tool(description = "Tìm kiếm sách nâng cao: cho phép lọc theo từ khoá, thể loại và trạng thái.")
    public String advancedSearch(String keyword, String categoryName, String status) {
        var books = bookRepository.findAll().stream();

        if (keyword != null && !keyword.isBlank()) {
            String kw = keyword.toLowerCase();
            books = books.filter(b -> (b.getTitle() != null && b.getTitle().toLowerCase().contains(kw))
                    || (b.getIsbn() != null && b.getIsbn().toLowerCase().contains(kw)));
        }
        if (categoryName != null && !categoryName.isBlank()) {
            String cat = categoryName.toLowerCase();
            books = books.filter(b -> b.getCategory() != null
                    && b.getCategory().getName().toLowerCase().contains(cat));
        }
        if (status != null && !status.isBlank()) {
            String st = status.toUpperCase();
            books = books.filter(b -> b.getStatus() != null && b.getStatus().name().equals(st));
        }

        List<Book> result = books.limit(10).toList();
        if (result.isEmpty()) return "Không tìm thấy sách phù hợp với điều kiện tìm kiếm.";
        StringBuilder sb = new StringBuilder("Kết quả tìm kiếm nâng cao:\n\n");
        for (int i = 0; i < result.size(); i++) {
            Book b = result.get(i);
            sb.append(i + 1).append(". ").append(b.getTitle())
                    .append(" - ").append(b.getAuthor() != null ? b.getAuthor().getName() : "?")
                    .append(" [").append(b.getStatus() != null ? b.getStatus().name() : "?").append("]\n");
        }
        return sb.toString();
    }

    // ==================== TÁC GIẢ ====================

    @Tool(description = "Lấy thông tin chi tiết của tác giả theo tên.")
    public String getAuthorInfo(String authorName) {
        if (authorName == null || authorName.isBlank()) return "Vui lòng nhập tên tác giả.";
        List<Author> authors = authorRepository.findAll().stream()
                .filter(a -> a.getName().toLowerCase().contains(authorName.toLowerCase()))
                .toList();
        if (authors.isEmpty()) return "Không tìm thấy tác giả: " + authorName;
        Author author = authors.getFirst();

        long bookCount = bookRepository.findAll().stream()
                .filter(b -> b.getAuthor() != null && b.getAuthor().getId().equals(author.getId()))
                .count();

        return """
                ✍️ Tác giả: %s
                📖 Tiểu sử: %s
                📚 Số sách trong thư viện: %d
                """.formatted(
                author.getName(),
                author.getBiography() != null ? author.getBiography() : "Chưa có thông tin",
                bookCount
        );
    }

    // ==================== THỂ LOẠI ====================

    @Tool(description = "Lấy danh sách tất cả các thể loại sách trong thư viện.")
    public String getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        if (categories.isEmpty()) return "Thư viện chưa có thể loại nào.";
        StringBuilder sb = new StringBuilder("Danh sách thể loại sách:\n\n");
        for (int i = 0; i < categories.size(); i++) {
            Category c = categories.get(i);
            long bookCount = bookRepository.findAll().stream()
                    .filter(b -> b.getCategory() != null && b.getCategory().getId().equals(c.getId()))
                    .count();
            sb.append(i + 1).append(". ").append(c.getName())
                    .append(" - ").append(c.getDescription() != null ? c.getDescription() : "")
                    .append(" (").append(bookCount).append(" cuốn)\n");
        }
        return sb.toString();
    }

    // ==================== THỐNG KÊ ====================

    @Tool(description = "Xem thống kê tổng quan về thư viện: tổng số sách, số bản sao, số lượng mượn, thành viên...")
    public String getLibraryStatistics() {
        long totalBooks = bookRepository.count();
        long totalCopies = bookCopyRepository.count();
        long availableCopies = bookCopyRepository.findAll().stream()
                .filter(c -> c.getStatus() == CopyStatus.AVAILABLE)
                .count();
        long borrowedCopies = bookCopyRepository.findAll().stream()
                .filter(c -> c.getStatus() == CopyStatus.BORROWED)
                .count();
        long totalBorrows = borrowRepository.count();
        long activeBorrows = borrowRepository.findAll().stream()
                .filter(b -> !b.isReturned())
                .count();
        long totalMembers = userRepository.count();

        return """
                📊 THỐNG KÊ THƯ VIỆN
                ─────────────────────
                📚 Tổng số đầu sách: %d
                📖 Tổng số bản sao: %d
                ✅ Có sẵn để mượn: %d
                🔄 Đang được mượn: %d
                📋 Tổng số phiếu mượn: %d
                📗 Đang mượn: %d
                👥 Tổng số thành viên: %d
                """.formatted(
                totalBooks, totalCopies, availableCopies, borrowedCopies,
                totalBorrows, activeBorrows, totalMembers
        );
    }

    @Tool(description = "Lấy danh sách các cuốn sách hiện có sẵn để mượn.")
    public String getAvailableBooks() {
        List<Book> availableBooks = bookRepository.findAll().stream()
                .filter(b -> b.getStatus() == BookStatus.AVAILABLE)
                .limit(15)
                .toList();
        if (availableBooks.isEmpty()) return "Hiện không có sách nào có sẵn để mượn.";
        StringBuilder sb = new StringBuilder("Sách hiện có sẵn để mượn:\n\n");
        for (int i = 0; i < availableBooks.size(); i++) {
            Book b = availableBooks.get(i);
            long copies = bookCopyRepository.findAll().stream()
                    .filter(c -> c.getBook().getId().equals(b.getId()) && c.getStatus() == CopyStatus.AVAILABLE)
                    .count();
            sb.append(i + 1).append(". ").append(b.getTitle())
                    .append(" - ").append(b.getAuthor() != null ? b.getAuthor().getName() : "?")
                    .append(" (").append(copies).append(" bản)\n");
        }
        return sb.toString();
    }

    // ==================== GÓI THÀNH VIÊN ====================

    @Tool(description = "Xem các gói membership (thẻ thành viên) hiện có của thư viện.")
    public String getMembershipPlans() {
        List<MembershipType> plans = membershipTypeRepository.findAll().stream()
                .filter(m -> m.getUserStatus() != null
                        && m.getUserStatus().name().equals("ACTIVE"))
                .toList();
        if (plans.isEmpty()) return "Hiện chưa có gói membership nào.";
        StringBuilder sb = new StringBuilder("Các gói membership:\n\n");
        for (int i = 0; i < plans.size(); i++) {
            MembershipType m = plans.get(i);
            sb.append(i + 1).append(". ").append(m.getName()).append("\n");
            sb.append("   💰 Giá: ").append(m.getPrice()).append(" VND\n");
            sb.append("   📚 Mượn tối đa: ").append(m.getBorrowLimit()).append(" cuốn\n");
            sb.append("   ⏱ Thời hạn: ").append(m.getBorrowDurationDay()).append(" ngày\n");
            sb.append("   📝 Mô tả: ").append(m.getDescription() != null ? m.getDescription() : "").append("\n\n");
        }
        return sb.toString();
    }

    // ==================== GIỚI THIỆU ====================

    @Tool(description = "Giới thiệu tổng quan về thư viện: địa chỉ, giờ mở cửa, dịch vụ, cách mượn sách.")
    public String getLibraryIntroduction() {
        return """
                🏛️ GIỚI THIỆU THƯ VIỆN
                ─────────────────────
                Chào mừng bạn đến với Hệ thống Quản lý Thư viện Trực tuyến!
                
                📍 Địa chỉ: Số 1, Đại học Bách Khoa, Hà Nội
                🕐 Giờ mở cửa:
                   - Thứ 2 - Thứ 6: 7:30 - 21:00
                   - Thứ 7 - Chủ nhật: 8:00 - 17:00
                
                📋 Dịch vụ:
                ✅ Mượn/Trả sách trực tuyến
                ✅ Tra cứu sách thông minh (AI)
                ✅ Quản lý thẻ thành viên (Membership)
                ✅ Thanh toán trực tuyến
                
                📚 Cách mượn sách:
                1. Đăng ký tài khoản thành viên
                2. Đăng ký gói Membership phù hợp
                3. Tìm sách và tạo phiếu mượn
                4. Đến thư viện nhận sách
                5. Trả sách đúng hạn để tránh phí phạt
                """;
    }
}
