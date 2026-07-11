package com.sbagroup5.library.record.book;

import lombok.Data;

@Data
public class BookRequest {
    private Long categoryId;
    private Long authorId;
    private String title;
    private Integer price;
    private String isbn;
    private String publisher;
    private Integer publishYear;
    private String description;
}
