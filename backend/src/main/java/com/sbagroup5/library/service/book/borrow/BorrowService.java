package com.sbagroup5.library.service.book.borrow;

import com.sbagroup5.library.entity.book.BookCopy;
import com.sbagroup5.library.entity.book.CopyStatus;
import com.sbagroup5.library.entity.book.borrow.Borrow;
import com.sbagroup5.library.entity.book.borrow.BorrowDetail;
import com.sbagroup5.library.entity.book.borrow.Fine;
import com.sbagroup5.library.entity.book.borrow.FineStatus;
import com.sbagroup5.library.entity.user.Membership;
import com.sbagroup5.library.entity.user.MembershipType;
import com.sbagroup5.library.entity.user.User;
import com.sbagroup5.library.record.borrow.BorrowItemResponse;
import com.sbagroup5.library.record.borrow.BorrowResponse;
import com.sbagroup5.library.record.borrow.CreateBorrowRequest;
import com.sbagroup5.library.record.borrow.FineResponse;
import com.sbagroup5.library.record.borrow.ReturnRequest;
import com.sbagroup5.library.record.borrow.ReturnResponse;
import com.sbagroup5.library.repository.book.BookCopyRepository;
import com.sbagroup5.library.repository.book.borrow.BorrowDetailRepository;
import com.sbagroup5.library.repository.book.borrow.BorrowRepository;
import com.sbagroup5.library.repository.book.borrow.FineRepository;
import com.sbagroup5.library.repository.user.MembershipRepository;
import com.sbagroup5.library.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class BorrowService {

    /** Số ngày mượn mặc định khi thành viên chưa có gói. */
    private static final int DEFAULT_DURATION_DAY = 14;
    /** Số sách được mượn tối đa mặc định khi thành viên chưa có gói. */
    private static final int DEFAULT_BORROW_LIMIT = 3;
    /** Mức phạt cho mỗi ngày trả trễ (VND). */
    private static final long FINE_PER_DAY = 5000L;
    private static final long DAY_IN_MILLIS = 24L * 60 * 60 * 1000;

    private final BorrowRepository borrowRepository;
    private final BorrowDetailRepository borrowDetailRepository;
    private final FineRepository fineRepository;
    private final BookCopyRepository bookCopyRepository;
    private final UserRepository userRepository;
    private final MembershipRepository membershipRepository;

    /**
     * Tạo phiếu mượn sách cho một thành viên.
     */
    @Transactional
    public BorrowResponse createBorrow(CreateBorrowRequest request) {
        if (request == null || request.username() == null || request.username().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thiếu thông tin thành viên");
        }
        if (request.barcodes() == null || request.barcodes().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Phiếu mượn phải có ít nhất một cuốn sách");
        }

        User user = userRepository.findById(request.username())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Không tìm thấy thành viên: " + request.username()));

        // Loại bỏ mã vạch trùng lặp, giữ nguyên thứ tự
        Set<String> barcodes = new LinkedHashSet<>(request.barcodes());

        int borrowLimit = DEFAULT_BORROW_LIMIT;
        int durationDay = DEFAULT_DURATION_DAY;
        Membership membership = membershipRepository.findByUser(user).orElse(null);
        if (membership != null && membership.getType() != null) {
            MembershipType type = membership.getType();
            if (type.getBorrowLimit() != null) {
                borrowLimit = type.getBorrowLimit();
            }
            if (type.getBorrowDurationDay() != null) {
                durationDay = type.getBorrowDurationDay();
            }
        }
        if (request.durationDay() != null) {
            if (request.durationDay() <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Số ngày mượn phải lớn hơn 0");
            }
            durationDay = request.durationDay();
        }

        long currentlyBorrowed = borrowDetailRepository.countByBorrow_UserAndReturnDateIsNull(user);
        if (currentlyBorrowed + barcodes.size() > borrowLimit) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Vượt quá giới hạn mượn (" + borrowLimit + " cuốn). Đang mượn: " + currentlyBorrowed);
        }

        // Xác thực toàn bộ bản sao trước khi ghi để tránh cập nhật một phần
        List<BookCopy> copies = new ArrayList<>();
        for (String barcode : barcodes) {
            BookCopy copy = bookCopyRepository.findByBarcode(barcode)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Không tìm thấy bản sao có mã: " + barcode));
            if (copy.getStatus() != CopyStatus.AVAILABLE
                    || borrowDetailRepository.existsByCopyAndReturnDateIsNull(copy)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "Bản sao không sẵn sàng để mượn: " + barcode);
            }
            copies.add(copy);
        }

        Date now = new Date();
        Borrow borrow = borrowRepository.save(Borrow.builder()
                .user(user)
                .borrowDate(now)
                .dueDate(addDays(now, durationDay))
                .returned(false)
                .build());

        List<BorrowDetail> details = new ArrayList<>();
        for (BookCopy copy : copies) {
            copy.setStatus(CopyStatus.BORROWED);
            bookCopyRepository.save(copy);
            details.add(borrowDetailRepository.save(BorrowDetail.builder()
                    .borrow(borrow)
                    .copy(copy)
                    .returnDate(null)
                    .build()));
        }

        return toBorrowResponse(borrow, details);
    }

    /**
     * Trả sách cho một phiếu mượn. Sinh phí phạt nếu trả trễ hạn.
     */
    @Transactional
    public ReturnResponse returnBooks(ReturnRequest request) {
        if (request == null || request.borrowId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thiếu id phiếu mượn");
        }

        Borrow borrow = borrowRepository.findById(request.borrowId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Không tìm thấy phiếu mượn: " + request.borrowId()));

        List<BorrowDetail> openDetails = borrowDetailRepository.findByBorrowAndReturnDateIsNull(borrow);
        if (openDetails.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Phiếu mượn đã được trả hết");
        }

        List<BorrowDetail> targets;
        if (request.barcodes() == null || request.barcodes().isEmpty()) {
            targets = openDetails;
        } else {
            Set<String> wanted = new LinkedHashSet<>(request.barcodes());
            targets = new ArrayList<>();
            for (String barcode : wanted) {
                BorrowDetail match = openDetails.stream()
                        .filter(d -> d.getCopy() != null && barcode.equals(d.getCopy().getBarcode()))
                        .findFirst()
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                "Mã vạch không thuộc phiếu mượn hoặc đã được trả: " + barcode));
                targets.add(match);
            }
        }

        Date now = new Date();
        List<BorrowItemResponse> returnedItems = new ArrayList<>();
        List<FineResponse> fines = new ArrayList<>();

        for (BorrowDetail detail : targets) {
            detail.setReturnDate(now);
            borrowDetailRepository.save(detail);

            BookCopy copy = detail.getCopy();
            if (copy != null) {
                copy.setStatus(CopyStatus.AVAILABLE);
                bookCopyRepository.save(copy);
            }

            long overdueDays = overdueDays(borrow.getDueDate(), now);
            if (overdueDays > 0) {
                Fine fine = fineRepository.save(Fine.builder()
                        .borrowDetail(detail)
                        .amount(overdueDays * FINE_PER_DAY)
                        .reason("Trả trễ " + overdueDays + " ngày")
                        .issuedDate(now)
                        .status(FineStatus.UNPAID)
                        .build());
                fines.add(toFineResponse(fine));
            }

            returnedItems.add(toItemResponse(detail));
        }

        boolean fullyReturned = borrowDetailRepository.countByBorrowAndReturnDateIsNull(borrow) == 0;
        if (fullyReturned && !borrow.isReturned()) {
            borrow.setReturned(true);
            borrowRepository.save(borrow);
        }

        return new ReturnResponse(borrow.getId(), fullyReturned, returnedItems, fines);
    }

    @Transactional(readOnly = true)
    public BorrowResponse getBorrow(Long id) {
        Borrow borrow = borrowRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Không tìm thấy phiếu mượn: " + id));
        return toBorrowResponse(borrow, borrowDetailRepository.findByBorrow(borrow));
    }

    @Transactional(readOnly = true)
    public List<BorrowResponse> listBorrowsByUser(String username) {
        User user = userRepository.findById(username)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Không tìm thấy thành viên: " + username));
        List<BorrowResponse> result = new ArrayList<>();
        for (Borrow borrow : borrowRepository.findByUserOrderByBorrowDateDesc(user)) {
            result.add(toBorrowResponse(borrow, borrowDetailRepository.findByBorrow(borrow)));
        }
        return result;
    }

    // ----- helpers -----

    private static Date addDays(Date from, int days) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(from);
        cal.add(Calendar.DAY_OF_MONTH, days);
        return cal.getTime();
    }

    /** Số ngày trễ hạn, làm tròn lên; 0 nếu chưa quá hạn. */
    private static long overdueDays(Date dueDate, Date returnDate) {
        if (dueDate == null) {
            return 0;
        }
        long diff = returnDate.getTime() - dueDate.getTime();
        if (diff <= 0) {
            return 0;
        }
        return (diff + DAY_IN_MILLIS - 1) / DAY_IN_MILLIS;
    }

    private BorrowResponse toBorrowResponse(Borrow borrow, List<BorrowDetail> details) {
        List<BorrowItemResponse> items = new ArrayList<>();
        for (BorrowDetail detail : details) {
            items.add(toItemResponse(detail));
        }
        User user = borrow.getUser();
        return new BorrowResponse(
                borrow.getId(),
                user != null ? user.getUsername() : null,
                user != null ? user.getFullName() : null,
                borrow.getBorrowDate(),
                borrow.getDueDate(),
                borrow.isReturned(),
                items);
    }

    private BorrowItemResponse toItemResponse(BorrowDetail detail) {
        BookCopy copy = detail.getCopy();
        String title = null;
        Long copyId = null;
        String barcode = null;
        if (copy != null) {
            copyId = copy.getId();
            barcode = copy.getBarcode();
            if (copy.getBook() != null) {
                title = copy.getBook().getTitle();
            }
        }
        return new BorrowItemResponse(detail.getId(), copyId, barcode, title, detail.getReturnDate());
    }

    private FineResponse toFineResponse(Fine fine) {
        BorrowDetail detail = fine.getBorrowDetail();
        String barcode = (detail != null && detail.getCopy() != null) ? detail.getCopy().getBarcode() : null;
        return new FineResponse(
                fine.getId(),
                detail != null ? detail.getId() : null,
                barcode,
                fine.getAmount(),
                fine.getReason(),
                fine.getIssuedDate(),
                fine.getStatus() != null ? fine.getStatus().name() : null);
    }
}
