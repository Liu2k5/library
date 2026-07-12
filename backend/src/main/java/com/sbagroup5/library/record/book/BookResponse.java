package com.sbagroup5.library.record.book;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BookResponse {
    private Long id;
    private Long categoryId;
    private Long authorId;
    private String category;
    private String author;
    private String title;
    private Integer price;
    private String isbn;
    private String publisher;
    private Integer publishYear;
    private String description;
    private String status;
}
