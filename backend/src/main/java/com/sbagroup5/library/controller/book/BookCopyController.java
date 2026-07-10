package com.sbagroup5.library.controller.book;

import com.sbagroup5.library.DTO.book.BookCopyRequest;
import com.sbagroup5.library.DTO.book.BookCopyResponse;
import com.sbagroup5.library.service.book.BookCopyService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/librarian")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class BookCopyController {

    private final BookCopyService bookCopyService;

    @GetMapping("/books/{bookId}/copies")
    public Page<BookCopyResponse> getBookCopies(
            @PathVariable Long bookId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size){

        return bookCopyService.getBookCopies(bookId,page,size);
    }

    @GetMapping("/bookcopies/{id}")
    public BookCopyResponse getBookCopy(@PathVariable Long id){

        return bookCopyService.getBookCopy(id);
    }

    @PostMapping("/books/{bookId}/copies")
    public BookCopyResponse create(
            @PathVariable Long bookId,
            @RequestBody BookCopyRequest request){

        return bookCopyService.create(bookId,request);
    }

    @PutMapping("/bookcopies/{id}")
    public BookCopyResponse update(
            @PathVariable Long id,
            @RequestBody BookCopyRequest request){

        return bookCopyService.update(id,request);
    }

    @PatchMapping("/bookcopies/{id}/status")
    public BookCopyResponse changeStatus(@PathVariable Long id){

        return bookCopyService.changeStatus(id);
    }

}
