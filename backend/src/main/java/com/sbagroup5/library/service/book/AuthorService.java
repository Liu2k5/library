package com.sbagroup5.library.service.book;

import com.sbagroup5.library.record.book.AuthorResponse;
import com.sbagroup5.library.record.book.AuthorRequest;
import com.sbagroup5.library.entity.book.Author;
import com.sbagroup5.library.repository.book.AuthorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthorService {

    private final AuthorRepository authorRepository;

    public Page<AuthorResponse> getAuthors(int page,int size,String keyword) {

        Pageable pageable = PageRequest.of(page, size);

        Page<Author> authors;

        if (keyword == null || keyword.isBlank()) {
            authors = authorRepository.findAll(pageable);
        } else {
            authors = authorRepository
                    .findByNameContainingIgnoreCase(keyword, pageable);
        }

        return authors.map(author ->
                AuthorResponse.builder()
                        .id(author.getId())
                        .name(author.getName())
                        .biography(author.getBiography())
                        .build()
        );
    }

    public List<AuthorResponse> getAll() {

        return authorRepository.findAll().stream()
                .map(author -> AuthorResponse.builder()
                        .id(author.getId())
                        .name(author.getName())
                        .biography(author.getBiography())
                        .build())
                .toList();

    }

    public AuthorResponse getAuthor(Long id) {

        Author author = authorRepository.findById(id)
                .orElseThrow();

        return AuthorResponse.builder()
                .id(author.getId())
                .name(author.getName())
                .biography(author.getBiography())
                .build();

    }

    public AuthorResponse create(AuthorRequest request) {

        Author author = Author.builder()
                .name(request.getName())
                .biography(request.getBiography())
                .build();

        authorRepository.save(author);

        return getAuthor(author.getId());

    }

    public AuthorResponse update(Long id, AuthorRequest request) {

        Author author = authorRepository.findById(id)
                .orElseThrow();

        author.setName(request.getName());
        author.setBiography(request.getBiography());

        authorRepository.save(author);

        return getAuthor(id);

    }

    public void delete(Long id) {

        authorRepository.deleteById(id);

    }

}
