package com.sbagroup5.library.record.book;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthorResponse {
    private Long id;
    private String name;
    private String biography;
}
