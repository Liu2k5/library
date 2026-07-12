package com.sbagroup5.library.record.book;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BookCopyResponse {
    private Long id;
    private Long bookId;
    private String bookTitle;
    private String barcode;
    private String location;
    private String status;
}
