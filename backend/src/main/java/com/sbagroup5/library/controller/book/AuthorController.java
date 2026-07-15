package com.sbagroup5.library.controller.book;

import com.sbagroup5.library.DTO.book.AuthorRequest;
import com.sbagroup5.library.DTO.book.AuthorResponse;
import com.sbagroup5.library.service.book.AuthorService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/librarian/authors")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuthorController {

    private final AuthorService authorService;

    @GetMapping
    public Page<AuthorResponse> getAuthors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false, defaultValue = "") String keyword) {

        return authorService.getAuthors(page, size, keyword);

    }

    @GetMapping("/all")
    public List<AuthorResponse> getAll() {

        return authorService.getAll();

    }

    @GetMapping("/{id}")
    public AuthorResponse getAuthor(@PathVariable Long id) {

        return authorService.getAuthor(id);

    }

    @PostMapping
    public AuthorResponse create(@RequestBody AuthorRequest request) {

        return authorService.create(request);

    }

    @PutMapping("/{id}")
    public AuthorResponse update(
            @PathVariable Long id,
            @RequestBody AuthorRequest request) {

        return authorService.update(id, request);

    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {

        authorService.delete(id);

    }

}
