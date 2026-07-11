package com.sbagroup5.library.service.payment;

import com.sbagroup5.library.entity.book.borrow.Fine;
import com.sbagroup5.library.entity.book.borrow.FineStatus;
import com.sbagroup5.library.entity.payment.Bill;
import com.sbagroup5.library.entity.payment.BillStatus;
import com.sbagroup5.library.entity.payment.Payment;
import com.sbagroup5.library.entity.payment.PaymentStatus;
import com.sbagroup5.library.entity.payment.PaymentType;
import com.sbagroup5.library.entity.user.Membership;
import com.sbagroup5.library.entity.user.MembershipType;
import com.sbagroup5.library.entity.user.User;
import com.sbagroup5.library.entity.user.UserStatus;
import com.sbagroup5.library.exception.BusinessException;
import com.sbagroup5.library.record.payment.PaymentRequest;
import com.sbagroup5.library.record.payment.PaymentResponse;
import com.sbagroup5.library.repository.book.borrow.FineRepository;
import com.sbagroup5.library.repository.payment.BillRepository;
import com.sbagroup5.library.repository.payment.PaymentRepository;
import com.sbagroup5.library.repository.user.MembershipRepository;
import com.sbagroup5.library.repository.user.MembershipTypeRepository;
import com.sbagroup5.library.repository.user.UserRepository;
import com.sbagroup5.library.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.payos.PayOS;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkRequest;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Calendar;
import java.util.Date;
import java.util.concurrent.ThreadLocalRandom;

/**
 * Dịch vụ xử lý thanh toán trực tuyến qua cổng PayOS.
 * Service này tách biệt, không ghi đè lên PaymentService cũ.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentProcessingService {

    private final PaymentRepository paymentRepository;
    private final BillRepository billRepository;
    private final FineRepository fineRepository;
    private final UserRepository userRepository;
    private final MembershipRepository membershipRepository;
    private final MembershipTypeRepository membershipTypeRepository;
    private final PayOS payOS;
    private final EmailService emailService;

    /**
     * Tạo giao dịch thanh toán mới và trả về đường dẫn thanh toán PayOS.
     */
    @Transactional
    public PaymentResponse createPayment(String username, PaymentRequest request) {
        User user = userRepository.findById(username)
                .orElseThrow(() -> new BusinessException("Không tìm thấy người dùng", "USER_NOT_FOUND"));

        // 1. Tạo Payment record
        long orderCode = generateOrderCode();
        Payment payment = Payment.builder()
                .id(orderCode)
                .user(user)
                .amount(request.amount())
                .type(request.type())
                .method("PayOS")
                .date(new Date())
                .status(PaymentStatus.PENDING)
                .build();

        paymentRepository.save(payment);

        // 2. Tạo link thanh toán PayOS
        String checkoutUrl;
        try {
            CreatePaymentLinkRequest paymentData = CreatePaymentLinkRequest.builder()
                    .orderCode(orderCode)
                    .amount(request.amount())
                    .expiredAt(LocalDateTime.now().plusMinutes(15)
                            .atZone(ZoneId.systemDefault()).toEpochSecond())
                    .description("THANHTOAN" + orderCode)
                    .returnUrl("http://localhost:3000/payment/success?orderCode=" + orderCode)
                    .cancelUrl("http://localhost:3000/payment/cancel?orderCode=" + orderCode)
                    .build();

            checkoutUrl = payOS.paymentRequests().create(paymentData).getCheckoutUrl();
            payment.setPaymentUrl(checkoutUrl);
            paymentRepository.save(payment);

        } catch (Exception e) {
            log.error("Lỗi tạo PayOS payment link: {}", e.getMessage(), e);
            payment.setStatus(PaymentStatus.FAILED);
            paymentRepository.save(payment);
            throw new BusinessException("Không thể tạo link thanh toán: " + e.getMessage(), "PAYOS_ERROR");
        }

        log.info("Đã tạo payment {} cho user {} với số tiền {}", orderCode, username, request.amount());

        return new PaymentResponse(
                payment.getId(),
                username,
                payment.getAmount(),
                payment.getType(),
                payment.getStatus(),
                payment.getMethod(),
                payment.getDate(),
                checkoutUrl,
                "Vui lòng hoàn tất thanh toán qua cổng PayOS"
        );
    }

    /**
     * Xác nhận thanh toán thành công (được gọi từ webhook).
     */
    @Transactional
    public void confirmPayment(Long paymentId, String transactionCode) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new BusinessException("Không tìm thấy giao dịch", "PAYMENT_NOT_FOUND"));

        if (payment.getStatus() == PaymentStatus.COMPLETED) {
            log.warn("Payment {} đã được xác nhận trước đó, bỏ qua.", paymentId);
            return;
        }

        // Cập nhật trạng thái Payment
        payment.setStatus(PaymentStatus.COMPLETED);
        paymentRepository.save(payment);

        // Tạo Bill record
        Bill bill = Bill.builder()
                .payment(payment)
                .gatewayName("PayOS")
                .transactionCode(transactionCode)
                .status(BillStatus.COMPLETED)
                .createdAt(new Date())
                .build();
        billRepository.save(bill);

        // Xử lý hậu quả theo loại thanh toán
        processPostPayment(payment);

        log.info("Đã xác nhận thanh toán {} thành công. Transaction: {}", paymentId, transactionCode);
    }

    /**
     * Xử lý sau khi thanh toán thành công.
     */
    private void processPostPayment(Payment payment) {
        User user = payment.getUser();

        if (payment.getType() == PaymentType.FINE) {
            // Thanh toán tiền phạt - cập nhật tất cả fine UNPAID của user thành PAID
            // (thực tế nên mapping cụ thể, nhưng tạm thời xử lý tổng quát)
            log.info("Đã thanh toán tiền phạt cho user {}", user.getUsername());
            // Lưu ý: cần cơ chế mapping fineId trong payment, hiện tại tạm để vậy

        } else if (payment.getType() == PaymentType.MEMBERSHIP) {
            // Thanh toán membership - kích hoạt/gia hạn membership cho user
            activateMembership(user);
            log.info("Đã kích hoạt membership cho user {}", user.getUsername());
        }

        // Gửi email xác nhận
        try {
            emailService.sendSimpleEmail(
                    user.getEmail(),
                    "Xác nhận thanh toán thành công - Mã giao dịch: " + payment.getId(),
                    "Cảm ơn bạn đã thanh toán!\n\n" +
                            "Mã giao dịch: " + payment.getId() + "\n" +
                            "Số tiền: " + payment.getAmount() + " VND\n" +
                            "Loại: " + payment.getType() + "\n" +
                            "Thời gian: " + payment.getDate() + "\n\n" +
                            "Trân trọng,\nThư viện trực tuyến"
            );
        } catch (Exception e) {
            log.error("Gửi email xác nhận thất bại cho {}: {}", user.getEmail(), e.getMessage());
        }
    }

    /**
     * Kích hoạt membership cho user.
     */
    private void activateMembership(User user) {
        // Tìm membership hiện tại hoặc tạo mới
        Membership membership = membershipRepository.findByUser(user).orElse(null);

        if (membership == null) {
            membership = Membership.builder()
                    .user(user)
                    .startDate(new Date())
                    .userStatus(UserStatus.ACTIVE)
                    .build();
        }

        // Gia hạn: nếu membership còn hạn thì cộng dồn, nếu hết thì bắt đầu từ hôm nay
        Date now = new Date();
        Date startDate;
        if (membership.getEndDate() != null && membership.getEndDate().after(now)) {
            startDate = membership.getEndDate(); // Gia hạn từ ngày hết hạn cũ
        } else {
            startDate = now; // Bắt đầu từ hôm nay
        }
        membership.setStartDate(startDate);

        // Mặc định membership 1 năm (có thể mapping từ MembershipType)
        Calendar cal = Calendar.getInstance();
        cal.setTime(startDate);
        cal.add(Calendar.YEAR, 1);
        membership.setEndDate(cal.getTime());
        membership.setUserStatus(UserStatus.ACTIVE);

        // Gán loại membership mặc định nếu chưa có
        if (membership.getType() == null) {
            MembershipType defaultType = membershipTypeRepository.findByName("Premium");
            if (defaultType == null) {
                // Tạo mới nếu chưa có
                defaultType = MembershipType.builder()
                        .name("Premium")
                        .price(100000L)
                        .borrowLimit(5)
                        .borrowDurationDay(14)
                        .description("Gói Premium mặc định")
                        .userStatus(UserStatus.ACTIVE)
                        .build();
                membershipTypeRepository.save(defaultType);
            }
            membership.setType(defaultType);
        }

        membershipRepository.save(membership);
    }

    /**
     * Xử lý webhook thanh toán từ PayOS.
     */
    @Transactional
    public void handleWebhook(Long orderCode, String transactionCode) {
        confirmPayment(orderCode, transactionCode);
    }

    /**
     * Tra cứu thông tin thanh toán.
     */
    public PaymentResponse getPaymentInfo(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new BusinessException("Không tìm thấy giao dịch", "PAYMENT_NOT_FOUND"));

        return new PaymentResponse(
                payment.getId(),
                payment.getUser().getUsername(),
                payment.getAmount(),
                payment.getType(),
                payment.getStatus(),
                payment.getMethod(),
                payment.getDate(),
                payment.getPaymentUrl(),
                null
        );
    }

    /**
     * Huỷ thanh toán.
     */
    @Transactional
    public PaymentResponse cancelPayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new BusinessException("Không tìm thấy giao dịch", "PAYMENT_NOT_FOUND"));

        if (payment.getStatus() != PaymentStatus.PENDING) {
            throw new BusinessException("Chỉ có thể huỷ giao dịch đang chờ", "INVALID_STATUS");
        }

        payment.setStatus(PaymentStatus.FAILED);
        paymentRepository.save(payment);

        return new PaymentResponse(
                payment.getId(),
                payment.getUser().getUsername(),
                payment.getAmount(),
                payment.getType(),
                payment.getStatus(),
                payment.getMethod(),
                payment.getDate(),
                null,
                "Đã huỷ giao dịch"
        );
    }

    /**
     * Lấy danh sách giao dịch của user.
     */
    public java.util.List<PaymentResponse> getUserPayments(String username) {
        User user = userRepository.findById(username)
                .orElseThrow(() -> new BusinessException("Không tìm thấy người dùng", "USER_NOT_FOUND"));

        return paymentRepository.findAll().stream()
                .filter(p -> p.getUser().getUsername().equals(username))
                .map(p -> new PaymentResponse(
                        p.getId(), p.getUser().getUsername(), p.getAmount(),
                        p.getType(), p.getStatus(), p.getMethod(), p.getDate(),
                        p.getPaymentUrl(), null))
                .toList();
    }

    /**
     * Sinh mã order code ngẫu nhiên (không trùng).
     */
    private long generateOrderCode() {
        long code;
        do {
            code = ThreadLocalRandom.current().nextLong(100_000L, 9_999_999_999L);
        } while (paymentRepository.findById(code).isPresent());
        return code;
    }
}
