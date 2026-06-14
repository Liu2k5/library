package com.sbagroup5.api;

import java.util.concurrent.CompletableFuture;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.sbagroup5.library.entity.payment.Payment;
import com.sbagroup5.library.service.EmailService;
import com.sbagroup5.library.service.payment.PaymentService;

import lombok.RequiredArgsConstructor;
import vn.payos.PayOS;
import vn.payos.model.webhooks.WebhookData;

@RequiredArgsConstructor
@RestController
public class PayOsWebhookApi {

    private final PayOS payOS;
    private final PaymentService paymentService;
    private final EmailService emailService;

    private void orderConfirmed(WebhookData paymentData) {
        Long paymentId = paymentData.getOrderCode();
        Payment payment = paymentService.findById(paymentId);
        emailService.sendSimpleEmail(payment.getUser().getEmail(),
                "Xác nhận thanh toán cho hóa đơn " + paymentId + " thành công",
                "Hóa đơn " + paymentId + " đã được thanh toán thành công với số tiền "
                        + paymentData.getAmount() + paymentData.getCurrency() + ".\n" +
                        "Thời gian thanh toán thành công: " + paymentData.getTransactionDateTime() + "\n" +
                        "Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi!");
    }

    @PostMapping(path = "/webhook")
    public void payosTransferHandler(@RequestBody Object body) {
        WebhookData data = payOS.webhooks().verify(body);
        CompletableFuture.runAsync(() -> orderConfirmed(data));
    }
}