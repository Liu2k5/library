package com.sbagroup5.library.controller;

import com.sbagroup5.library.DTO.book.BookRequest;
import com.sbagroup5.library.DTO.book.BookResponse;
import com.sbagroup5.library.service.book.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/librarian/books")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class BookController {

    private final BookService bookService;

    @GetMapping
    public Page<BookResponse> getBooks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return bookService.getBooks(page, size);
    }

    @GetMapping("/{id}")
    public BookResponse getBook(@PathVariable Long id) {
        return bookService.getBook(id);
    }

    @PostMapping
    public BookResponse create(@RequestBody BookRequest request) {
        return bookService.create(request);
    }

    @PutMapping("/{id}")
    public BookResponse update(
            @PathVariable Long id,
            @RequestBody BookRequest request
    ) {
        return bookService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        bookService.delete(id);
    }

}
