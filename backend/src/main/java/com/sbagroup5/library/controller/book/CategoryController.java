package com.sbagroup5.library.controller.book;

import java.util.List;

import com.sbagroup5.library.record.book.CategoryRequest;
import com.sbagroup5.library.record.book.CategoryResponse;
import com.sbagroup5.library.service.book.CategoryService;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/librarian/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public Page<CategoryResponse> getCategories(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false, defaultValue = "") String keyword) {

        return categoryService.getCategories(page, size, keyword);

    }

    @GetMapping("/all")
    public List<CategoryResponse> getAll() {

        return categoryService.getAll();

    }

    @GetMapping("/{id}")
    public CategoryResponse getCategory(@PathVariable Long id) {

        return categoryService.getCategory(id);

    }

    @PostMapping
    public CategoryResponse create(@RequestBody CategoryRequest request) {

        return categoryService.create(request);

    }

    @PutMapping("/{id}")
    public CategoryResponse update(
            @PathVariable Long id,
            @RequestBody CategoryRequest request) {

        return categoryService.update(id, request);

    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {

        categoryService.delete(id);

    }

}
