// package com.sbagroup5.library.service;

// import jakarta.annotation.PostConstruct;

// import com.sbagroup5.library.entity.book.Author;
// import com.sbagroup5.library.entity.book.Book;
// import com.sbagroup5.library.entity.book.BookCopy;
// import com.sbagroup5.library.entity.book.BookStatus;
// import com.sbagroup5.library.entity.book.Category;
// import com.sbagroup5.library.entity.book.CopyStatus;
// import com.sbagroup5.library.entity.user.MembershipType;
// import com.sbagroup5.library.entity.user.UserStatus;
// import com.sbagroup5.library.repository.book.AuthorRepository;
// import com.sbagroup5.library.repository.book.BookCopyRepository;
// import com.sbagroup5.library.repository.book.BookRepository;
// import com.sbagroup5.library.repository.book.CategoryRepository;
// import com.sbagroup5.library.repository.user.MembershipTypeRepository;

// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;

// import lombok.RequiredArgsConstructor;
// import lombok.extern.slf4j.Slf4j;

// /**
//  * Service tạo dữ liệu mẫu cho việc chạy thử.
//  * Tự động chạy khi ứng dụng khởi động nếu database chưa có dữ liệu sách.
//  */
// @Service
// @RequiredArgsConstructor
// @Slf4j
// public class DataSeedService {

//     private final CategoryRepository categoryRepository;
//     private final AuthorRepository authorRepository;
//     private final BookRepository bookRepository;
//     private final BookCopyRepository bookCopyRepository;
//     private final MembershipTypeRepository membershipTypeRepository;

// //     @PostConstruct
// //     @Transactional
// //     public void seedData() {
// //         if (bookRepository.count() > 0) {
// //             log.info("Database đã có dữ liệu, bỏ qua seed.");
// //             return;
// //         }

// //         log.info("Bắt đầu tạo dữ liệu mẫu...");

// //         // 1. Tạo thể loại
// //         Category vanHoc = createCategory("Văn học", "Sách văn học trong và ngoài nước");
// //         Category khoaHoc = createCategory("Khoa học", "Sách khoa học tự nhiên và xã hội");
// //         Category kinhTe = createCategory("Kinh tế", "Sách về kinh tế, tài chính, quản trị");
// //         Category thieuNhi = createCategory("Thiếu nhi", "Sách dành cho thiếu nhi");
// //         Category lichSu = createCategory("Lịch sử", "Sách về lịch sử Việt Nam và thế giới");
// //         Category congNghe = createCategory("Công nghệ", "Sách về công nghệ thông tin, lập trình");
// //         Category tamLy = createCategory("Tâm lý", "Sách về tâm lý học, phát triển bản thân");

// //         // 2. Tạo tác giả
// //         Author author1 = createAuthor("Nguyễn Nhật Ánh", "Nhà văn Việt Nam chuyên viết cho thiếu nhi và tuổi mới lớn");
// //         Author author2 = createAuthor("Paulo Coelho", "Nhà văn người Brazil, nổi tiếng với cuốn 'Nhà giả kim'");
// //         Author author3 = createAuthor("Robert Kiyosaki",
// //                 "Tác giả người Mỹ, nổi tiếng với bộ sách 'Cha giàu cha nghèo'");
// //         Author author4 = createAuthor("Yuval Noah Harari",
// //                 "Nhà sử học người Israel, tác giả bộ sách về lịch sử loài người");
// //         Author author5 = createAuthor("J.K. Rowling", "Nhà văn người Anh, tác giả bộ truyện Harry Potter");
// //         Author author6 = createAuthor("Dale Carnegie", "Nhà văn Mỹ, chuyên gia về kỹ năng sống và giao tiếp");
// //         Author author7 = createAuthor("Trần Quốc Vượng", "Nhà sử học, khảo cổ học nổi tiếng Việt Nam");
// //         Author author8 = createAuthor("Martin Kleppmann", "Kỹ sư phần mềm, tác giả sách về hệ thống phân tán");

// //         // 3. Tạo sách
// //         Book book1 = createBook(vanHoc, author1, "Mắt biếc", 95000, "9786049876543", "NXB Trẻ", 2020,
// //                 "Tác phẩm nổi tiếng của nhà văn Nguyễn Nhật Ánh, kể về mối tình đơn phương của Ngạn dành cho Hà Lan.");

// //         Book book2 = createBook(vanHoc, author2, "Nhà giả kim", 79000, "9786048765432", "NXB Văn học", 2019,
// //                 "Cuốn sách bán chạy nhất mọi thời đại, kể về hành trình của chàng chăn cừu Santiago đi tìm kho báu.");

// //         Book book3 = createBook(kinhTe, author3, "Cha giàu cha nghèo", 120000, "9786047654321", "NXB Trẻ", 2021,
// //                 "Cuốn sách tài chính cá nhân kinh điển, dạy về tư duy làm giàu và quản lý tiền bạc.");

// //         Book book4 = createBook(lichSu, author4, "Sapiens: Lược sử loài người", 150000, "9786046543210", "NXB Tri thức",
// //                 2020,
// //                 "Cuốn sách kể về lịch sử tiến hóa của loài người từ thời kỳ đồ đá đến thời đại công nghệ.");

// //         Book book5 = createBook(thieuNhi, author5, "Harry Potter và Hòn đá phù thủy", 135000, "9786045432109",
// //                 "NXB Trẻ", 2018,
// //                 "Tập đầu tiên trong bộ truyện Harry Potter kể về cậu bé phù thủy nổi tiếng.");

// //         Book book6 = createBook(tamLy, author6, "Đắc nhân tâm", 89000, "9786044321098", "NXB Tổng hợp", 2022,
// //                 "Cuốn sách kinh điển về nghệ thuật giao tiếp và ứng xử trong cuộc sống.");

// //         Book book7 = createBook(lichSu, author7, "Việt Nam sử lược", 180000, "9786043210987", "NXB Văn hóa", 2017,
// //                 "Bộ sử quan trọng nhất về lịch sử Việt Nam do học giả Trần Trọng Kim biên soạn.");

// //         Book book8 = createBook(congNghe, author8, "Thiết kế hệ thống dữ liệu", 250000, "9786042109876",
// //                 "NXB Công nghệ", 2021,
// //                 "Cuốn sách chuyên sâu về thiết kế hệ thống phân tán, cơ sở dữ liệu và xử lý dữ liệu lớn.");

// //         Book book9 = createBook(khoaHoc, author4, "Homo Deus: Lược sử tương lai", 165000, "9786041098765",
// //                 "NXB Tri thức", 2021,
// //                 "Cuốn sách tiếp nối Sapiens, dự đoán tương lai loài người trong kỷ nguyên công nghệ.");

// //         Book book10 = createBook(kinhTe, author3, "Dạy con làm giàu", 110000, "9786030987654", "NXB Trẻ", 2022,
// //                 "Cuốn sách dạy về tư duy tài chính cho giới trẻ và cách xây dựng sự giàu có.");

// //         // 4. Tạo bản sao sách
// //         createCopies(book1, "BC-001", "BC-002", "BC-003");
// //         createCopies(book2, "BC-004", "BC-005");
// //         createCopies(book3, "BC-006", "BC-007", "BC-008");
// //         createCopies(book4, "BC-009", "BC-010");
// //         createCopies(book5, "BC-011", "BC-012", "BC-013", "BC-014");
// //         createCopies(book6, "BC-015", "BC-016");
// //         createCopies(book7, "BC-017", "BC-018", "BC-019");
// //         createCopies(book8, "BC-020", "BC-021");
// //         createCopies(book9, "BC-022");
// //         createCopies(book10, "BC-023", "BC-024", "BC-025");

// //         // 5. Tạo loại membership
// //         createMembershipTypes();

// //         log.info("Hoàn tất tạo dữ liệu mẫu!");
// //     }

// //     private Category createCategory(String name, String description) {
// //         Category category = Category.builder()
// //                 .name(name)
// //                 .description(description)
// //                 .build();
// //         return categoryRepository.save(category);
// //     }

// //     private Author createAuthor(String name, String biography) {
// //         Author author = Author.builder()
// //                 .name(name)
// //                 .biography(biography)
// //                 .build();
// //         return authorRepository.save(author);
// //     }

// //     private Book createBook(Category category, Author author, String title, Integer price,
// //             String isbn, String publisher, Integer publishYear, String description) {
// //         Book book = Book.builder()
// //                 .category(category)
// //                 .author(author)
// //                 .title(title)
// //                 .price(price)
// //                 .isbn(isbn)
// //                 .publisher(publisher)
// //                 .publishYear(publishYear)
// //                 .description(description)
// //                 .status(BookStatus.AVAILABLE)
// //                 .build();
// //         return bookRepository.save(book);
// //     }

// //     private void createCopies(Book book, String... barcodes) {
// //         for (String barcode : barcodes) {
// //             BookCopy copy = BookCopy.builder()
// //                     .book(book)
// //                     .barcode(barcode)
// //                     .status(CopyStatus.AVAILABLE)
// //                     .location("Kệ A-" + barcode.charAt(barcode.length() - 1))
// //                     .build();
// //             bookCopyRepository.save(copy);
// //         }
// //     }

// //     private void createMembershipTypes() {
// //         if (membershipTypeRepository.count() == 0) {
// //             membershipTypeRepository.save(MembershipType.builder()
// //                     .name("Cơ bản")
// //                     .price(50000L)
// //                     .borrowLimit(2)
// //                     .borrowDurationDay(7)
// //                     .description("Gói cơ bản, mượn tối đa 2 cuốn trong 7 ngày")
// //                     .userStatus(UserStatus.ACTIVE)
// //                     .build());

// //             membershipTypeRepository.save(MembershipType.builder()
// //                     .name("Premium")
// //                     .price(100000L)
// //                     .borrowLimit(5)
// //                     .borrowDurationDay(14)
// //                     .description("Gói Premium, mượn tối đa 5 cuốn trong 14 ngày")
// //                     .userStatus(UserStatus.ACTIVE)
// //                     .build());    q1

// //             membershipTypeRepository.save(MembershipType.builder()
// //                     .name("VIP")
// //                     .price(200000L)
// //                     .borrowLimit(10)
// //                     .borrowDurationDay(30)
// //                     .description("Gói VIP, mượn tối đa 10 cuốn trong 30 ngày")
// //                     .userStatus(UserStatus.ACTIVE)
// //                     .build());

// //             log.info("Đã tạo 3 loại membership: Cơ bản, Premium, VIP");
// //         }
// //     }
// }
