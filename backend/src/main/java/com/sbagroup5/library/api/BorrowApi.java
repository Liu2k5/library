package com.sbagroup5.library.api;

import com.sbagroup5.library.record.borrow.BorrowResponse;
import com.sbagroup5.library.record.borrow.CreateBorrowRequest;
import com.sbagroup5.library.record.borrow.FineResponse;
import com.sbagroup5.library.record.borrow.ReportLostRequest;
import com.sbagroup5.library.record.borrow.ReturnRequest;
import com.sbagroup5.library.record.borrow.ReturnResponse;
import com.sbagroup5.library.service.book.borrow.BorrowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * API cho thủ thư: lập phiếu mượn và trả sách.
 */
@RestController
@RequestMapping("/api/librarian/borrows")
@RequiredArgsConstructor
public class BorrowApi {

    private final BorrowService borrowService;

    /** Tạo phiếu mượn sách mới. */
    @PostMapping
    public ResponseEntity<BorrowResponse> createBorrow(@RequestBody CreateBorrowRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(borrowService.createBorrow(request));
    }

    /** Trả sách cho một phiếu mượn (toàn bộ hoặc theo danh sách mã vạch). */
    @PostMapping("/return")
    public ResponseEntity<ReturnResponse> returnBooks(@RequestBody ReturnRequest request) {
        return ResponseEntity.ok(borrowService.returnBooks(request));
    }

    /** Lập phiếu phạt do mất sách (đánh dấu bản sao LOST và tạo bản ghi phạt). */
    @PostMapping("/lost")
    public ResponseEntity<FineResponse> reportLost(@RequestBody ReportLostRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(borrowService.reportLost(request));
    }

    /** Xem chi tiết một phiếu mượn. */
    @GetMapping("/{id}")
    public ResponseEntity<BorrowResponse> getBorrow(@PathVariable Long id) {
        return ResponseEntity.ok(borrowService.getBorrow(id));
    }

    /** Liệt kê các phiếu mượn của một thành viên theo email. */
    @GetMapping
    public ResponseEntity<List<BorrowResponse>> listByEmail(@RequestParam String email) {
        return ResponseEntity.ok(borrowService.listBorrowsByEmail(email));
    }
}
