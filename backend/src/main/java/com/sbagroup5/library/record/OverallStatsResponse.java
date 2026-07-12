package com.sbagroup5.library.record;
/**
 * Response for GET /admin/dashboard/overall
 *
 * revenue         tong Payment.amount voi status = COMPLETED
 * userCount       so luong User co role = MEMBER (doc gia)
 * librarianCount  so luong User co role = LIBRARIAN (thu thu)
 * bookCount       tong so dau sach (Book) trong catalog
 */
public record OverallStatsResponse(
        long revenue,
        long userCount,
        long librarianCount,
        long bookCount) {
}
