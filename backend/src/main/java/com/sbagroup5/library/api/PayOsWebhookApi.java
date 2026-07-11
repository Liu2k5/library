package com.sbagroup5.library.api;

import java.util.concurrent.CompletableFuture;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.sbagroup5.library.service.payment.PaymentProcessingService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.payos.PayOS;
import vn.payos.model.webhooks.WebhookData;

@Slf4j
@RequiredArgsConstructor
@RestController
public class PayOsWebhookApi {

    private final PayOS payOS;
    private final PaymentProcessingService paymentProcessingService;

    /**
     * Xử lý callback từ PayOS khi có giao dịch thanh toán.
     * Cập nhật trạng thái Payment, tạo Bill, gửi email xác nhận.
     */
    @PostMapping(path = "/webhook")
    public void payosTransferHandler(@RequestBody Object body) {
        WebhookData data = payOS.webhooks().verify(body);
        CompletableFuture.runAsync(() -> {
            try {
                Long paymentId = data.getOrderCode();
                String transactionCode = data.getReference();
                log.info("Nhận webhook thanh toán: paymentId={}, transactionCode={}",
                        paymentId, transactionCode);
                paymentProcessingService.handleWebhook(paymentId, transactionCode);
            } catch (Exception e) {
                log.error("Lỗi xử lý webhook thanh toán: {}", e.getMessage(), e);
            }
        });
    }
}