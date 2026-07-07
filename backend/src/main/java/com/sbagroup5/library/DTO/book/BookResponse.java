package com.sbagroup5.library.DTO.book;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BookResponse {

    private Long id;

    private String title;

    private String category;

    private String author;

    private Integer price;

    private String isbn;

    private String publisher;

    private Integer publishYear;

    private String status;
}
