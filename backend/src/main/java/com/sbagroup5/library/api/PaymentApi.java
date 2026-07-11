package com.sbagroup5.library.api;

import com.sbagroup5.library.entity.user.User;
import com.sbagroup5.library.record.payment.PaymentRequest;
import com.sbagroup5.library.record.payment.PaymentResponse;
import com.sbagroup5.library.service.auth.AuthService;
import com.sbagroup5.library.service.payment.PaymentProcessingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<List<PaymentResponse>> getMyPayments() {
        User currentUser = authService.getCurrentUser();
        List<PaymentResponse> payments = paymentProcessingService.getUserPayments(currentUser.getUsername());
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
}
