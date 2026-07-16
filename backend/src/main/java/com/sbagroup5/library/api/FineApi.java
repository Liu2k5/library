package com.sbagroup5.library.api;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sbagroup5.library.record.borrow.FineDetailResponse;
import com.sbagroup5.library.record.borrow.PayFineRequest;
import com.sbagroup5.library.record.payment.PaymentResponse;
import com.sbagroup5.library.service.book.borrow.FineService;

import lombok.RequiredArgsConstructor;

/**
 * API cho thủ thư: xem và xử lý thanh toán phiếu phạt.
 */
@RestController
@RequestMapping("/api/librarian/fines")
@RequiredArgsConstructor
public class FineApi {

    private final FineService fineService;

    /** Danh sách phiếu phạt (mới nhất trước), lọc tùy chọn theo trạng thái. */
    @GetMapping
    public ResponseEntity<List<FineDetailResponse>> listFines(
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(fineService.listFines(status));
    }

    /** Đánh dấu phiếu phạt đã thanh toán (tiền mặt / xác nhận), tùy chọn đổi trạng thái bản sao. */
    @PostMapping("/{id}/pay")
    public ResponseEntity<FineDetailResponse> markPaid(
            @PathVariable Long id,
            @RequestBody(required = false) PayFineRequest request) {
        String copyStatus = request != null ? request.copyStatus() : null;
        return ResponseEntity.ok(fineService.markPaid(id, copyStatus));
    }

    /** Tạo link/QR thanh toán PayOS cho phiếu phạt (khách quét chuyển khoản). */
    @PostMapping("/{id}/payos")
    public ResponseEntity<PaymentResponse> createFinePayment(@PathVariable Long id) {
        return ResponseEntity.ok(fineService.createFinePayment(id));
    }
}
