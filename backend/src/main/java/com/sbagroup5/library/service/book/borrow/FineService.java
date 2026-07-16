package com.sbagroup5.library.service.book.borrow;

import java.util.Comparator;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.sbagroup5.library.entity.book.BookCopy;
import com.sbagroup5.library.entity.book.CopyStatus;
import com.sbagroup5.library.entity.book.borrow.BorrowDetail;
import com.sbagroup5.library.entity.book.borrow.Fine;
import com.sbagroup5.library.entity.book.borrow.FineStatus;
import com.sbagroup5.library.entity.payment.PaymentType;
import com.sbagroup5.library.entity.user.User;
import com.sbagroup5.library.record.borrow.FineDetailResponse;
import com.sbagroup5.library.record.payment.PaymentRequest;
import com.sbagroup5.library.record.payment.PaymentResponse;
import com.sbagroup5.library.repository.book.BookCopyRepository;
import com.sbagroup5.library.repository.book.borrow.FineRepository;
import com.sbagroup5.library.service.payment.PaymentProcessingService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FineService {

    private final FineRepository fineRepository;
    private final BookCopyRepository bookCopyRepository;
    private final PaymentProcessingService paymentProcessingService;

    /**
     * Liệt kê toàn bộ phiếu phạt (mới nhất trước), có thể lọc theo trạng thái.
     *
     * @param status PAID / UNPAID / WAIVED (không phân biệt hoa thường); null = tất cả
     */
    @Transactional(readOnly = true)
    public List<FineDetailResponse> listFines(String status) {
        return fineRepository.findAll().stream()
                .filter(f -> status == null || status.isBlank()
                        || (f.getStatus() != null && f.getStatus().name().equalsIgnoreCase(status)))
                .sorted(Comparator.comparing(
                        Fine::getIssuedDate,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .map(this::toDetailResponse)
                .toList();
    }

    /**
     * Đánh dấu phiếu phạt đã thanh toán (tiền mặt hoặc xác nhận sau khi chuyển khoản).
     * Tùy chọn cập nhật trạng thái bản sao sách liên quan (do thủ thư chọn).
     *
     * @param copyStatus AVAILABLE / UNAVAILABLE (không phân biệt hoa thường); null/blank = giữ nguyên
     */
    @Transactional
    public FineDetailResponse markPaid(Long fineId, String copyStatus) {
        Fine fine = fineRepository.findById(fineId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Không tìm thấy phiếu phạt: " + fineId));

        fine.setStatus(FineStatus.PAID);
        fineRepository.save(fine);

        if (copyStatus != null && !copyStatus.isBlank()) {
            CopyStatus newStatus;
            try {
                newStatus = CopyStatus.valueOf(copyStatus.trim().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Trạng thái bản sao không hợp lệ: " + copyStatus);
            }
            BorrowDetail detail = fine.getBorrowDetail();
            if (detail != null && detail.getCopy() != null) {
                BookCopy copy = detail.getCopy();
                copy.setStatus(newStatus);
                bookCopyRepository.save(copy);
            }
        }

        return toDetailResponse(fine);
    }

    /**
     * Tạo link/QR thanh toán PayOS cho một phiếu phạt (đứng tên thành viên bị phạt).
     * Thủ thư đưa QR cho khách quét; sau khi khách trả, thủ thư bấm markPaid để xác nhận.
     */
    @Transactional
    public PaymentResponse createFinePayment(Long fineId) {
        Fine fine = fineRepository.findById(fineId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Không tìm thấy phiếu phạt: " + fineId));

        if (fine.getStatus() == FineStatus.PAID) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Phiếu phạt đã được thanh toán");
        }

        BorrowDetail detail = fine.getBorrowDetail();
        User member = (detail != null && detail.getBorrow() != null)
                ? detail.getBorrow().getUser() : null;
        if (member == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Không xác định được thành viên của phiếu phạt");
        }

        PaymentRequest request = new PaymentRequest(
                PaymentType.FINE, fine.getAmount(), fine.getId(), null);
        return paymentProcessingService.createPayment(member.getUsername(), request);
    }

    private FineDetailResponse toDetailResponse(Fine fine) {
        BorrowDetail detail = fine.getBorrowDetail();
        Long borrowId = null;
        String barcode = null;
        String bookTitle = null;
        String username = null;
        String fullName = null;
        String email = null;

        if (detail != null) {
            BookCopy copy = detail.getCopy();
            if (copy != null) {
                barcode = copy.getBarcode();
                if (copy.getBook() != null) {
                    bookTitle = copy.getBook().getTitle();
                }
            }
            if (detail.getBorrow() != null) {
                borrowId = detail.getBorrow().getId();
                User user = detail.getBorrow().getUser();
                if (user != null) {
                    username = user.getUsername();
                    fullName = user.getFullName();
                    email = user.getEmail();
                }
            }
        }

        return new FineDetailResponse(
                fine.getId(),
                borrowId,
                barcode,
                bookTitle,
                username,
                fullName,
                email,
                fine.getAmount(),
                fine.getReason(),
                fine.getIssuedDate(),
                fine.getStatus() != null ? fine.getStatus().name() : null);
    }
}
