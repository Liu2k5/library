package com.sbagroup5.library.api;

import com.sbagroup5.library.entity.payment.Payment;
import com.sbagroup5.library.service.EmailService;
import com.sbagroup5.library.service.payment.PaymentProcessingService;
import com.sbagroup5.library.service.payment.PaymentService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.payos.PayOS;
import vn.payos.model.webhooks.WebhookData;

@RequiredArgsConstructor
@RestController
@Slf4j
public class PayOsWebhookApi {

    private final PayOS payOS;
    private final PaymentService paymentService;
    private final PaymentProcessingService paymentProcessingService;
    private final EmailService emailService;

    @PostMapping(path = "/webhook")
    public void payosTransferHandler(@RequestBody Object body) {
        log.info("WEBHOOK RECEIVED FROM PAYOS");

        try {
            WebhookData data = payOS.webhooks().verify(body);
            log.info("Webhook verified successfully");
            log.info("Order Code: {}", data.getOrderCode());
            log.info("Amount: {}", data.getAmount());

            orderConfirmed(data);

            log.info("WEBHOOK PROCESSED SUCCESSFULLY");

        } catch (Exception e) {
            log.error("WEBHOOK ERROR: {}", e.getMessage(), e);
        }
    }

    private void orderConfirmed(WebhookData paymentData) {
        try {
            Long paymentId = paymentData.getOrderCode();
            String transactionCode = String.valueOf(paymentData.getOrderCode());

            paymentProcessingService.handleWebhook(paymentId, transactionCode);

            Payment payment = paymentService.findById(paymentId);

            if (payment != null) {
                String subject = "Payment Confirmation - Transaction: " + paymentId;
                String body = "Payment Confirmation\n\n" +
                        "Dear " + payment.getUser().getUsername() + ",\n\n" +
                        "We have received your payment successfully.\n\n" +
                        "Transaction ID: " + paymentId + "\n" +
                        "Amount: " + payment.getAmount() + " VND\n" +
                        "Payment Type: " + payment.getType() + "\n" +
                        "Date: " + payment.getDate() + "\n\n" +
                        "Thank you for using our service!\n\n" +
                        "Best regards,\n" +
                        "Library Management Team";

                emailService.sendSimpleEmail(
                        payment.getUser().getEmail(),
                        subject,
                        body);
                log.info("Payment confirmation email sent to: {}", payment.getUser().getEmail());
            }

        } catch (Exception e) {
            log.error("Error processing webhook: {}", e.getMessage(), e);
        }
    }
}