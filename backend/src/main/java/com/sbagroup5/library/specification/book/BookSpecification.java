package com.sbagroup5.library.specification.book;

import com.sbagroup5.library.entity.book.Book;
import com.sbagroup5.library.entity.book.BookStatus;
import org.springframework.data.jpa.domain.Specification;

public class BookSpecification {

    public static Specification<Book> filter(
            String keyword,
            Long categoryId,
            String status
    ){

        return (root, query, cb)->{

            var predicate = cb.conjunction();

            // Search title hoặc isbn
            if(keyword != null && !keyword.isBlank()){

                predicate = cb.and(
                        predicate,
                        cb.or(
                                cb.like(
                                        cb.lower(root.get("title")),
                                        "%" + keyword.toLowerCase() + "%"
                                ),
                                cb.like(
                                        cb.lower(root.get("isbn")),
                                        "%" + keyword.toLowerCase() + "%"
                                )
                        )
                );

            }

            // Category

            if(categoryId != null){

                predicate = cb.and(
                        predicate,
                        cb.equal(
                                root.get("category").get("id"),
                                categoryId
                        )
                );

            }

            // Status

            if(status != null && !status.isBlank()){

                predicate = cb.and(
                        predicate,
                        cb.equal(
                                root.get("status"),
                                BookStatus.valueOf(status)
                        )
                );

            }

            return predicate;

        };

    }

}
