package com.sbagroup5.library.record.borrow;

import java.io.Serializable;
import java.util.List;

/**
 * Yêu cầu tạo phiếu mượn sách do thủ thư lập.
 *
 * @param email       email của thành viên mượn sách (dùng để định danh)
 * @param barcodes    danh sách mã vạch của các bản sao sách được mượn
 * @param durationDay số ngày mượn (tùy chọn); nếu null sẽ lấy theo gói thành viên
 */
public record CreateBorrowRequest(
        String email,
        List<String> barcodes,
        Integer durationDay) implements Serializable {
}
