package com.sbagroup5.library.DTO.book;

import lombok.Data;

@Data
public class BookCopyRequest {

    private String barcode;

    private String location;

}