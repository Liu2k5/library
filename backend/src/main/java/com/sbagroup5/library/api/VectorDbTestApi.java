package com.sbagroup5.library.api;

import com.sbagroup5.library.service.VectorDbDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * API test để kích hoạt việc đẩy dữ liệu lên Vector Database (Pinecone).
 * Chỉ dùng cho mục đích phát triển / chạy thử.
 */
@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMIN')")
public class VectorDbTestApi {

    private final VectorDbDataService vectorDbDataService;

    /**
     * POST /api/test/load-vector-db
     * Xoá dữ liệu cũ và đẩy tất cả sách từ database lên Pinecone.
     */
    @PostMapping("/load-vector-db")
    public ResponseEntity<Map<String, String>> loadVectorDb() {
        vectorDbDataService.loadAllBooksToVectorDb();
        return ResponseEntity.ok(Map.of("message", "Đã đẩy dữ liệu lên vector database thành công"));
    }

    /**
     * POST /api/test/clear-vector-db
     * Xoá toàn bộ dữ liệu trong vector database.
     */
    @PostMapping("/clear-vector-db")
    public ResponseEntity<Map<String, String>> clearVectorDb() {
        vectorDbDataService.clearVectorDb();
        return ResponseEntity.ok(Map.of("message", "Đã xoá dữ liệu trong vector database"));
    }
}
