package com.sbagroup5.library.service;

import com.sbagroup5.library.entity.book.Book;
import com.sbagroup5.library.entity.book.BookCopy;
import com.sbagroup5.library.entity.book.Category;
import com.sbagroup5.library.entity.book.Author;
import com.sbagroup5.library.repository.book.BookRepository;
import com.sbagroup5.library.repository.book.BookCopyRepository;
import io.pinecone.clients.Index;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Dịch vụ chuyên trách đẩy dữ liệu sách, tác giả, thể loại lên Pinecone vector database
 * để phục vụ tìm kiếm ngữ nghĩa (RAG) cho AI.
 * <p>
 * Khi chạy, service này sẽ:
 * 1. Xoá toàn bộ dữ liệu cũ trong Pinecone index
 * 2. Đọc tất cả sách từ database
 * 3. Tạo Document với nội dung phong phú (tiêu đề, mô tả, tác giả, thể loại...)
 * 4. Đẩy lên vector store
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class VectorDbDataService {

    private final BookRepository bookRepository;
    private final BookCopyRepository bookCopyRepository;
    private final VectorStore vectorStore;
    private final Index pineconeIndex;

    /**
     * Xoá dữ liệu cũ và đẩy toàn bộ sách lên vector database.
     */
    public void loadAllBooksToVectorDb() {
        log.info("Bắt đầu xoá dữ liệu cũ khỏi Pinecone...");
        pineconeIndex.deleteAll("__default__");
        log.info("Đã xoá dữ liệu cũ. Bắt đầu đọc sách từ database...");

        List<Book> books = bookRepository.findAll();
        if (books.isEmpty()) {
            log.warn("Không có sách nào trong database để đẩy lên vector DB!");
            return;
        }

        List<Document> documents = new ArrayList<>();
        for (Book book : books) {
            Document doc = buildDocument(book);
            if (doc != null) {
                documents.add(doc);
            }
        }

        log.info("Đang đẩy {} tài liệu lên Pinecone...", documents.size());
        vectorStore.add(documents);
        log.info("Hoàn tất! Đã đẩy {} tài liệu lên vector database.", documents.size());
    }

    /**
     * Tạo Document từ một cuốn sách.
     */
    private Document buildDocument(Book book) {
        Author author = book.getAuthor();
        Category category = book.getCategory();

        // Đếm số lượng bản sao có sẵn
        long availableCopies = bookCopyRepository.findAll().stream()
                .filter(copy -> copy.getBook().getId().equals(book.getId()))
                .filter(copy -> copy.getStatus() != null &&
                        copy.getStatus().name().equals("AVAILABLE"))
                .count();

        // Xây dựng nội dung văn bản giàu thông tin
        StringBuilder content = new StringBuilder();
        content.append("Tên sách: ").append(book.getTitle()).append("\n");

        if (author != null) {
            content.append("Tác giả: ").append(author.getName()).append("\n");
            if (author.getBiography() != null && !author.getBiography().isBlank()) {
                content.append("Tiểu sử tác giả: ").append(author.getBiography()).append("\n");
            }
        }

        if (category != null) {
            content.append("Thể loại: ").append(category.getName()).append("\n");
            if (category.getDescription() != null && !category.getDescription().isBlank()) {
                content.append("Mô tả thể loại: ").append(category.getDescription()).append("\n");
            }
        }

        if (book.getIsbn() != null && !book.getIsbn().isBlank()) {
            content.append("ISBN: ").append(book.getIsbn()).append("\n");
        }

        if (book.getPublisher() != null && !book.getPublisher().isBlank()) {
            content.append("Nhà xuất bản: ").append(book.getPublisher()).append("\n");
        }

        if (book.getPublishYear() != null) {
            content.append("Năm xuất bản: ").append(book.getPublishYear()).append("\n");
        }

        if (book.getPrice() != null) {
            content.append("Giá: ").append(book.getPrice()).append(" VND\n");
        }

        if (book.getDescription() != null && !book.getDescription().isBlank()) {
            content.append("Mô tả: ").append(book.getDescription()).append("\n");
        }

        content.append("Số bản có sẵn: ").append(availableCopies).append("\n");

        // Metadata để filter khi truy vấn
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("bookId", book.getId());
        metadata.put("title", book.getTitle() != null ? book.getTitle() : "");
        metadata.put("author", author != null ? author.getName() : "");
        metadata.put("category", category != null ? category.getName() : "");
        metadata.put("isbn", book.getIsbn() != null ? book.getIsbn() : "");
        metadata.put("publisher", book.getPublisher() != null ? book.getPublisher() : "");
        metadata.put("publishYear", book.getPublishYear() != null ? book.getPublishYear() : 0);
        metadata.put("price", book.getPrice() != null ? book.getPrice() : 0);
        metadata.put("availableCopies", availableCopies);
        metadata.put("type", "book");

        return new Document(content.toString(), metadata);
    }

    /**
     * Xoá toàn bộ dữ liệu trong vector database.
     */
    public void clearVectorDb() {
        pineconeIndex.deleteAll("__default__");
        log.info("Đã xoá toàn bộ dữ liệu trong Pinecone.");
    }
}
