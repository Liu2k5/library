package com.sbagroup5.library.api;

import jakarta.validation.Valid;

import com.sbagroup5.library.entity.user.User;
import com.sbagroup5.library.record.payment.BillResponse;
import com.sbagroup5.library.record.payment.PaymentRequest;
import com.sbagroup5.library.record.payment.PaymentResponse;
import com.sbagroup5.library.service.auth.AuthService;
import com.sbagroup5.library.service.payment.PaymentProcessingService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

/**
 * API cho khách hàng: tạo giao dịch thanh toán, tra cứu, huỷ.
 */
@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentApi {

    private final PaymentProcessingService paymentProcessingService;
    private final AuthService authService;

    /**
     * Tạo giao dịch thanh toán mới (membership / fine).
     * Trả về đường dẫn checkout PayOS.
     */
    @PostMapping("/create")
    public ResponseEntity<PaymentResponse> createPayment(@Valid @RequestBody PaymentRequest request) {
        User currentUser = authService.getCurrentUser();
        PaymentResponse response = paymentProcessingService.createPayment(currentUser.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Lấy thông tin một giao dịch thanh toán.
     */
    @GetMapping("/{paymentId}")
    public ResponseEntity<PaymentResponse> getPayment(@PathVariable Long paymentId) {
        PaymentResponse response = paymentProcessingService.getPaymentInfo(paymentId);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy danh sách giao dịch của người dùng hiện tại.
     */
    @GetMapping("/my-payments")
    public ResponseEntity<Page<PaymentResponse>> getMyPayments(
            @PageableDefault(size = 10, sort = "date", direction = Sort.Direction.DESC) Pageable pageable) {
        User currentUser = authService.getCurrentUser();
        Page<PaymentResponse> payments = paymentProcessingService.getUserPayments(currentUser.getUsername(), pageable);
        return ResponseEntity.ok(payments);
    }

    /**
     * Huỷ giao dịch thanh toán đang chờ.
     */
    @PostMapping("/{paymentId}/cancel")
    public ResponseEntity<PaymentResponse> cancelPayment(@PathVariable Long paymentId) {
        PaymentResponse response = paymentProcessingService.cancelPayment(paymentId);
        return ResponseEntity.ok(response);
    }

    /**
     * Get bill for a specific payment
     */
    @GetMapping("/{paymentId}/bill")
    public ResponseEntity<BillResponse> getBill(@PathVariable Long paymentId) {
        BillResponse response = paymentProcessingService.getBillByPaymentId(paymentId);
        return ResponseEntity.ok(response);
    }
}
