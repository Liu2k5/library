package com.sbagroup5.library.service.book;

import java.util.List;

import com.sbagroup5.library.entity.book.Category;
import com.sbagroup5.library.record.book.CategoryRequest;
import com.sbagroup5.library.record.book.CategoryResponse;
import com.sbagroup5.library.repository.book.CategoryRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public Page<CategoryResponse> getCategories(int page, int size, String keyword) {

        Pageable pageable = PageRequest.of(page, size);

        Page<Category> categories;

        if (keyword == null || keyword.isBlank()) {
            categories = categoryRepository.findAll(pageable);
        } else {
            categories = categoryRepository
                    .findByNameContainingIgnoreCase(keyword, pageable);
        }

        return categories.map(category -> CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .build());
    }

    public List<CategoryResponse> getAll() {

        return categoryRepository.findAll().stream()
                .map(category -> CategoryResponse.builder()
                        .id(category.getId())
                        .name(category.getName())
                        .description(category.getDescription())
                        .build())
                .toList();

    }

    public CategoryResponse getCategory(Long id) {

        Category category = categoryRepository.findById(id)
                .orElseThrow();

        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .build();

    }

    public CategoryResponse create(CategoryRequest request) {

        Category category = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();

        categoryRepository.save(category);

        return getCategory(category.getId());

    }

    public CategoryResponse update(Long id, CategoryRequest request) {

        Category category = categoryRepository.findById(id)
                .orElseThrow();

        category.setName(request.getName());
        category.setDescription(request.getDescription());

        categoryRepository.save(category);

        return getCategory(id);

    }

    public void delete(Long id) {

        categoryRepository.deleteById(id);

    }

}
