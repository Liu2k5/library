package com.sbagroup5.library.service.payment;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.payos.PayOS;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkRequest;

import java.time.LocalDateTime;
import java.time.ZoneId;

import org.springframework.stereotype.Service;

import com.sbagroup5.library.entity.payment.Payment;
import com.sbagroup5.library.repository.payment.PaymentRepository;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {
    private PaymentRepository paymentRepository;
    private PayOS payOS;

    public Payment findById(Long id) {
        return paymentRepository.findById(id).orElse(null);
    }

    public String getCheckoutUrlByPaymentId(Long id) {
        Payment payment = paymentRepository.findById(id).orElse(null);
        if (payment == null) return "";
        
        try {
            CreatePaymentLinkRequest paymentData =
            CreatePaymentLinkRequest.builder()
                    .orderCode(payment.getId())
                    .amount(payment.getAmount())
                    .expiredAt(LocalDateTime.now().plusMinutes(2).atZone(ZoneId.systemDefault()).toEpochSecond())
                    .description("FS" + payment.getId())
                    .returnUrl("http://localhost:8080/customer/order-success")
                    .cancelUrl("http://localhost:8080/customer/order-cancel")
                    .build();
            return payOS.paymentRequests().create(paymentData).getCheckoutUrl();            
        } catch (Exception e) {
            log.error(e.getMessage());
            throw e;
        }
    }
}
