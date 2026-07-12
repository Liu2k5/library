package com.sbagroup5.library.service.dashboardadmin;

import org.springframework.stereotype.Service;

import com.sbagroup5.library.entity.payment.PaymentStatus;
import com.sbagroup5.library.record.OverallStatsResponse;
import com.sbagroup5.library.repository.book.BookRepository;
import com.sbagroup5.library.repository.payment.PaymentRepository;
import com.sbagroup5.library.repository.user.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardService {

    // TODO: doi 2 gia tri nay cho khop voi du lieu that trong cot role.name
    private static final String ROLE_MEMBER = "MEMBER";
    private static final String ROLE_LIBRARIAN = "LIBRARIAN";

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    public OverallStatsResponse getOverallStats() {
        Long revenue = paymentRepository.sumAmountByStatus(PaymentStatus.COMPLETED);
        long userCount = userRepository.countByRoleName(ROLE_MEMBER);
        long librarianCount = userRepository.countByRoleName(ROLE_LIBRARIAN);
        long bookCount = bookRepository.count();

        return new OverallStatsResponse(
                revenue == null ? 0L : revenue,
                userCount,
                librarianCount,
                bookCount);
    }
}
