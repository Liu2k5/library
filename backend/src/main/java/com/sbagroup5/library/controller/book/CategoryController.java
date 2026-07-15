package com.sbagroup5.library.controller.book;

import com.sbagroup5.library.DTO.book.CategoryRequest;
import com.sbagroup5.library.DTO.book.CategoryResponse;
import com.sbagroup5.library.service.book.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
