BEGIN TRY
    BEGIN TRANSACTION;

    --------------------------------------------------
    -- ROLE
    --------------------------------------------------
    INSERT INTO role(name, description)
    VALUES
    (N'ADMIN', N'Quản trị hệ thống'),
    (N'LIBRARIAN', N'Thủ thư'),
    (N'MEMBER', N'Thành viên thường'),
    (N'VIP', N'Thành viên VIP'),
    (N'GUEST', N'Khách');

    --------------------------------------------------
    -- CATEGORY
    --------------------------------------------------
    INSERT INTO category(name, description)
    VALUES
    (N'Công nghệ', N'Sách CNTT'),
    (N'Văn học', N'Tác phẩm văn học'),
    (N'Kinh tế', N'Sách kinh tế'),
    (N'Lịch sử', N'Sách lịch sử'),
    (N'Khoa học', N'Sách khoa học');

    --------------------------------------------------
    -- AUTHOR
    --------------------------------------------------
    INSERT INTO author(name, biography)
    VALUES
    (N'Nguyễn Nhật Ánh', N'Tác giả văn học Việt Nam'),
    (N'Martin Fowler', N'Chuyên gia thiết kế phần mềm'),
    (N'Robert C. Martin', N'Uncle Bob'),
    (N'Yuval Noah Harari', N'Nhà sử học'),
    (N'Adam Smith', N'Nhà kinh tế học');

    --------------------------------------------------
    -- MEMBERSHIP TYPE
    --------------------------------------------------
    INSERT INTO membership_type
    (
        name,
        description,
        borrow_duration_day,
        borrow_limit,
        price,
        user_status
    )
    VALUES
    (N'Thường', N'Gói cơ bản', 14, 3, 50000, 1),
    (N'Bạc', N'Gói bạc', 21, 5, 100000, 1),
    (N'Vàng', N'Gói vàng', 30, 10, 200000, 1),
    (N'Kim Cương', N'Gói cao cấp', 45, 15, 500000, 1),
    (N'Dùng thử', N'Gói miễn phí', 7, 1, 0, 1);

    --------------------------------------------------
    -- USERS
    --------------------------------------------------
    INSERT INTO users
    (
        username,
        full_name,
        password,
        email,
        phone,
        address,
        created_at,
        user_status,
        role_id
    )
    VALUES
    (
        'user01',
        N'Nguyễn Văn An',
        '123456',
        'user01@gmail.com',
        '0901000001',
        N'Hà Nội',
        GETDATE(),
        1,
        (SELECT id FROM role WHERE name = N'MEMBER')
    ),
    (
        'user02',
        N'Trần Thị Bình',
        '123456',
        'user02@gmail.com',
        '0901000002',
        N'Hồ Chí Minh',
        GETDATE(),
        1,
        (SELECT id FROM role WHERE name = N'MEMBER')
    ),
    (
        'user03',
        N'Lê Minh Châu',
        '123456',
        'user03@gmail.com',
        '0901000003',
        N'Đà Nẵng',
        GETDATE(),
        1,
        (SELECT id FROM role WHERE name = N'VIP')
    ),
    (
        'user04',
        N'Phạm Quốc Dũng',
        '123456',
        'user04@gmail.com',
        '0901000004',
        N'Hải Phòng',
        GETDATE(),
        1,
        (SELECT id FROM role WHERE name = N'LIBRARIAN')
    ),
    (
        'user05',
        N'Hoàng Thu Hà',
        '123456',
        'user05@gmail.com',
        '0901000005',
        N'Cần Thơ',
        GETDATE(),
        1,
        (SELECT id FROM role WHERE name = N'ADMIN')
    );

    --------------------------------------------------
    -- BOOK
    --------------------------------------------------
    INSERT INTO book
    (
        title,
        description,
        isbn,
        price,
        publish_year,
        publisher,
        status,
        author_id,
        category_id
    )
    VALUES
    (
        N'Mắt Biếc',
        N'Tiểu thuyết nổi tiếng',
        'ISBN001',
        120000,
        2019,
        N'NXB Trẻ',
        1,
        (SELECT id FROM author WHERE name = N'Nguyễn Nhật Ánh'),
        (SELECT id FROM category WHERE name = N'Văn học')
    ),
    (
        N'Refactoring',
        N'Cải tiến mã nguồn',
        'ISBN002',
        450000,
        2018,
        N'Addison Wesley',
        1,
        (SELECT id FROM author WHERE name = N'Martin Fowler'),
        (SELECT id FROM category WHERE name = N'Công nghệ')
    ),
    (
        N'Clean Code',
        N'Lập trình sạch',
        'ISBN003',
        500000,
        2020,
        N'Prentice Hall',
        1,
        (SELECT id FROM author WHERE name = N'Robert C. Martin'),
        (SELECT id FROM category WHERE name = N'Công nghệ')
    ),
    (
        N'Sapiens',
        N'Lược sử loài người',
        'ISBN004',
        350000,
        2017,
        N'Harper',
        1,
        (SELECT id FROM author WHERE name = N'Yuval Noah Harari'),
        (SELECT id FROM category WHERE name = N'Lịch sử')
    ),
    (
        N'Wealth of Nations',
        N'Nền tảng kinh tế học',
        'ISBN005',
        400000,
        2015,
        N'Penguin',
        1,
        (SELECT id FROM author WHERE name = N'Adam Smith'),
        (SELECT id FROM category WHERE name = N'Kinh tế')
    );

    --------------------------------------------------
    -- BOOK COPY
    --------------------------------------------------
    INSERT INTO book_copy
    (
        barcode,
        location,
        status,
        book_id
    )
    VALUES
    (
        'BC001',
        N'Kệ A1',
        1,
        (SELECT id FROM book WHERE isbn = 'ISBN001')
    ),
    (
        'BC002',
        N'Kệ A2',
        1,
        (SELECT id FROM book WHERE isbn = 'ISBN002')
    ),
    (
        'BC003',
        N'Kệ B1',
        1,
        (SELECT id FROM book WHERE isbn = 'ISBN003')
    ),
    (
        'BC004',
        N'Kệ B2',
        0,
        (SELECT id FROM book WHERE isbn = 'ISBN004')
    ),
    (
        'BC005',
        N'Kệ C1',
        1,
        (SELECT id FROM book WHERE isbn = 'ISBN005')
    );

    --------------------------------------------------
    -- MEMBERSHIP
    --------------------------------------------------
    INSERT INTO membership
    (
        start_date,
        end_date,
        user_status,
        type_id,
        user_id
    )
    VALUES
    (
        GETDATE(),
        DATEADD(DAY,14,GETDATE()),
        1,
        (SELECT id FROM membership_type WHERE name = N'Thường'),
        'user01'
    ),
    (
        GETDATE(),
        DATEADD(DAY,21,GETDATE()),
        1,
        (SELECT id FROM membership_type WHERE name = N'Bạc'),
        'user02'
    ),
    (
        GETDATE(),
        DATEADD(DAY,30,GETDATE()),
        1,
        (SELECT id FROM membership_type WHERE name = N'Vàng'),
        'user03'
    ),
    (
        GETDATE(),
        DATEADD(DAY,45,GETDATE()),
        1,
        (SELECT id FROM membership_type WHERE name = N'Kim Cương'),
        'user04'
    ),
    (
        GETDATE(),
        DATEADD(DAY,7,GETDATE()),
        1,
        (SELECT id FROM membership_type WHERE name = N'Dùng thử'),
        'user05'
    );

    --------------------------------------------------
    -- BORROW
    --------------------------------------------------
    INSERT INTO borrow
    (
        borrow_date,
        due_date,
        returned,
        user_id
    )
    VALUES
    (GETDATE(), DATEADD(DAY,14,GETDATE()), 0, 'user01'),
    (GETDATE(), DATEADD(DAY,14,GETDATE()), 1, 'user02'),
    (GETDATE(), DATEADD(DAY,21,GETDATE()), 0, 'user03'),
    (GETDATE(), DATEADD(DAY,7,GETDATE()), 1, 'user04'),
    (GETDATE(), DATEADD(DAY,14,GETDATE()), 0, 'user05');

    --------------------------------------------------
    -- BORROW DETAIL
    --------------------------------------------------
    INSERT INTO borrow_detail
    (
        return_date,
        borrow_id,
        copy_id
    )
    VALUES
    (
        NULL,
        (SELECT MIN(id) FROM borrow WHERE user_id='user01'),
        (SELECT id FROM book_copy WHERE barcode='BC001')
    ),
    (
        DATEADD(DAY,10,GETDATE()),
        (SELECT MIN(id) FROM borrow WHERE user_id='user02'),
        (SELECT id FROM book_copy WHERE barcode='BC002')
    ),
    (
        NULL,
        (SELECT MIN(id) FROM borrow WHERE user_id='user03'),
        (SELECT id FROM book_copy WHERE barcode='BC003')
    ),
    (
        DATEADD(DAY,5,GETDATE()),
        (SELECT MIN(id) FROM borrow WHERE user_id='user04'),
        (SELECT id FROM book_copy WHERE barcode='BC004')
    ),
    (
        NULL,
        (SELECT MIN(id) FROM borrow WHERE user_id='user05'),
        (SELECT id FROM book_copy WHERE barcode='BC005')
    );

    --------------------------------------------------
    -- FINE
    --------------------------------------------------
    INSERT INTO fine
    (
        amount,
        issued_date,
        reason,
        status,
        borrow_detail_id
    )
    VALUES
    (
        50000,
        GETDATE(),
        N'Trả sách trễ',
        0,
        (SELECT MIN(bd.id)
         FROM borrow_detail bd
         JOIN borrow b ON b.id = bd.borrow_id
         WHERE b.user_id='user01')
    ),
    (
        30000,
        GETDATE(),
        N'Hư hỏng sách',
        1,
        (SELECT MIN(bd.id)
         FROM borrow_detail bd
         JOIN borrow b ON b.id = bd.borrow_id
         WHERE b.user_id='user02')
    ),
    (
        100000,
        GETDATE(),
        N'Mất sách',
        0,
        (SELECT MIN(bd.id)
         FROM borrow_detail bd
         JOIN borrow b ON b.id = bd.borrow_id
         WHERE b.user_id='user03')
    ),
    (
        20000,
        GETDATE(),
        N'Quá hạn',
        1,
        (SELECT MIN(bd.id)
         FROM borrow_detail bd
         JOIN borrow b ON b.id = bd.borrow_id
         WHERE b.user_id='user04')
    ),
    (
        50000,
        GETDATE(),
        N'Trả trễ',
        0,
        (SELECT MIN(bd.id)
         FROM borrow_detail bd
         JOIN borrow b ON b.id = bd.borrow_id
         WHERE b.user_id='user05')
    );

    --------------------------------------------------
    -- PAYMENT
    --------------------------------------------------
    INSERT INTO payment
    (
        id,
        amount,
        date,
        method,
        payment_url,
        status,
        type,
        user_id
    )
    VALUES
    (900001, 50000, GETDATE(), 'MOMO',  'https://payment.example/900001', 1, 1, 'user01'),
    (900002, 100000, GETDATE(), 'VNPAY', 'https://payment.example/900002', 1, 1, 'user02'),
    (900003, 200000, GETDATE(), 'BANK',  'https://payment.example/900003', 1, 1, 'user03'),
    (900004, 500000, GETDATE(), 'MOMO',  'https://payment.example/900004', 0, 1, 'user04'),
    (900005, 0, GETDATE(), 'FREE', NULL, 1, 1, 'user05');

    --------------------------------------------------
    -- BILL
    --------------------------------------------------
    INSERT INTO bill
    (
        created_at,
        gateway_name,
        status,
        transaction_code,
        payment_id
    )
    VALUES
    (GETDATE(), 'MOMO', 1, 'TXN-900001', 900001),
    (GETDATE(), 'VNPAY', 1, 'TXN-900002', 900002),
    (GETDATE(), 'BANK', 1, 'TXN-900003', 900003),
    (GETDATE(), 'MOMO', 0, 'TXN-900004', 900004),
    (GETDATE(), 'FREE', 1, 'TXN-900005', 900005);

    --------------------------------------------------
    -- NOTIFICATION
    --------------------------------------------------
    INSERT INTO notification
    (
        created_at,
        is_read,
        message,
        title,
        type,
        user_id
    )
    VALUES
    (
        GETDATE(),
        0,
        N'Sắp đến hạn trả sách',
        N'Nhắc trả sách',
        1,
        'user01'
    ),
    (
        GETDATE(),
        1,
        N'Thanh toán thành công',
        N'Thanh toán',
        2,
        'user02'
    ),
    (
        GETDATE(),
        0,
        N'Tài khoản được nâng cấp',
        N'Nâng cấp hội viên',
        2,
        'user03'
    ),
    (
        GETDATE(),
        1,
        N'Sách đã được trả',
        N'Hoàn trả sách',
        1,
        'user04'
    ),
    (
        GETDATE(),
        0,
        N'Chào mừng đến thư viện',
        N'Xin chào',
        3,
        'user05'
    );

    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    ROLLBACK TRANSACTION;

    THROW;
END CATCH;