package com.sbagroup5.library.service.book;

import com.sbagroup5.library.entity.book.Book;
import com.sbagroup5.library.entity.book.BookCopy;
import com.sbagroup5.library.entity.book.CopyStatus;
import com.sbagroup5.library.record.book.BookCopyRequest;
import com.sbagroup5.library.record.book.BookCopyResponse;
import com.sbagroup5.library.repository.book.BookCopyRepository;
import com.sbagroup5.library.repository.book.BookRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookCopyService {

    private final BookRepository bookRepository;
    private final BookCopyRepository bookCopyRepository;

    private BookCopyResponse toResponse(BookCopy copy) {

        return BookCopyResponse.builder()
                .id(copy.getId())
                .bookId(copy.getBook().getId())
                .bookTitle(copy.getBook().getTitle())
                .barcode(copy.getBarcode())
                .location(copy.getLocation())
                .status(copy.getStatus().name())
                .build();
    }

    // Danh sách copy theo Book
    public Page<BookCopyResponse> getBookCopies(Long bookId, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        return bookCopyRepository
                .findByBookId(bookId, pageable)
                .map(this::toResponse);
    }

    // Chi tiết
    public BookCopyResponse getBookCopy(Long id) {

        BookCopy copy = bookCopyRepository.findById(id)
                .orElseThrow();

        return toResponse(copy);
    }

    // Thêm
    public BookCopyResponse create(Long bookId, BookCopyRequest request) {

        if (bookCopyRepository.existsByBarcode(request.getBarcode())) {
            throw new RuntimeException("Barcode already exists.");
        }

        Book book = bookRepository.findById(bookId)
                .orElseThrow();

        BookCopy copy = BookCopy.builder()
                .book(book)
                .barcode(request.getBarcode())
                .location(request.getLocation())
                .status(CopyStatus.AVAILABLE)
                .build();

        bookCopyRepository.save(copy);

        return toResponse(copy);
    }

    // Sửa
    public BookCopyResponse update(Long id, BookCopyRequest request) {

        BookCopy copy = bookCopyRepository.findById(id)
                .orElseThrow();

        if (!copy.getBarcode().equals(request.getBarcode())
                && bookCopyRepository.existsByBarcode(request.getBarcode())) {

            throw new RuntimeException("Barcode already exists.");
        }

        copy.setBarcode(request.getBarcode());
        copy.setLocation(request.getLocation());

        bookCopyRepository.save(copy);

        return toResponse(copy);
    }

    // Đổi trạng thái
    public BookCopyResponse changeStatus(Long id) {

        BookCopy copy = bookCopyRepository.findById(id)
                .orElseThrow();

        if (copy.getStatus() == CopyStatus.BORROWED) {
            throw new RuntimeException("Borrowed copy cannot change status.");
        }

        if (copy.getStatus() == CopyStatus.AVAILABLE) {
            copy.setStatus(CopyStatus.UNAVAILABLE);
        } else {
            copy.setStatus(CopyStatus.AVAILABLE);
        }

        bookCopyRepository.save(copy);

        return toResponse(copy);
    }

}
