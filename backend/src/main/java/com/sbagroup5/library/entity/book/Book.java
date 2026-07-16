package com.sbagroup5.library.entity.book;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Category category;

    @JoinColumn(name = "author_id")
    @ManyToOne
    private Author author;

    @Column(columnDefinition = "NVARCHAR(200) NOT NULL")
    private String title;

    private Integer price;

    private String isbn;

    @Column(columnDefinition = "NVARCHAR(100)")
    private String publisher;

    private Integer publishYear;

    @Column(columnDefinition = "NTEXT")
    private String description;

    private BookStatus status;

}
