package com.sbagroup5.library.service.book;

import com.sbagroup5.library.DTO.book.BookRequest;
import com.sbagroup5.library.DTO.book.BookResponse;
import com.sbagroup5.library.entity.book.Author;
import com.sbagroup5.library.entity.book.Book;
import com.sbagroup5.library.entity.book.BookStatus;
import com.sbagroup5.library.entity.book.Category;
import com.sbagroup5.library.repository.book.AuthorRepository;
import com.sbagroup5.library.repository.book.BookRepository;
import com.sbagroup5.library.repository.book.CategoryRepository;
import org.springframework.data.domain.Page;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BookService {
    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final CategoryRepository categoryRepository;

    //Lay Danh Sach Books
    public Page<BookResponse> getBooks(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        return bookRepository.findAll(pageable)
                .map(book -> BookResponse.builder()
                        .id(book.getId())
                        .title(book.getTitle())
                        .author(book.getAuthor().getName())
                        .category(book.getCategory().getName())
                        .price(book.getPrice())
                        .isbn(book.getIsbn())
                        .publisher(book.getPublisher())
                        .publishYear(book.getPublishYear())
                        .status(book.getStatus().name())
                        .build());
    }

    //Book Details
    public BookResponse getBook(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow();

        return BookResponse.builder()
                .id(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor().getName())
                .category(book.getCategory().getName())
                .price(book.getPrice())
                .isbn(book.getIsbn())
                .publisher(book.getPublisher())
                .publishYear(book.getPublishYear())
                .status(book.getStatus().name())
                .build();
    }

    //Them Books
    public BookResponse create(BookRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow();

        Author author = authorRepository.findById(request.getAuthorId())
                .orElseThrow();

        Book book = Book.builder()
                .title(request.getTitle())
                .category(category)
                .author(author)
                .price(request.getPrice())
                .isbn(request.getIsbn())
                .publisher(request.getPublisher())
                .publishYear(request.getPublishYear())
                .description(request.getDescription())
                .status(BookStatus.AVAILABLE)
                .build();

        bookRepository.save(book);

        return getBook(book.getId());
    }

    //Sua Books
    public BookResponse update(Long id, BookRequest request) {
        Book book = bookRepository.findById(id)
                .orElseThrow();

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow();

        Author author = authorRepository.findById(request.getAuthorId())
                .orElseThrow();

        book.setTitle(request.getTitle());
        book.setCategory(category);
        book.setAuthor(author);
        book.setPrice(request.getPrice());
        book.setIsbn(request.getIsbn());
        book.setPublisher(request.getPublisher());
        book.setPublishYear(request.getPublishYear());
        book.setDescription(request.getDescription());

        bookRepository.save(book);

        return getBook(id);
    }

    //Xoa Books
    public void delete(Long id) {
        bookRepository.deleteById(id);
    }
}
