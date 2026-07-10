package com.sbagroup5.library.record.borrow;

import java.io.Serializable;
import java.util.List;

/**
 * Yêu cầu tạo phiếu mượn sách do thủ thư lập.
 *
 * @param username    tên đăng nhập của thành viên mượn sách
 * @param barcodes    danh sách mã vạch của các bản sao sách được mượn
 * @param durationDay số ngày mượn (tùy chọn); nếu null sẽ lấy theo gói thành viên
 */
public record CreateBorrowRequest(
        String username,
        List<String> barcodes,
        Integer durationDay) implements Serializable {
}
