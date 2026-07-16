import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getBooks } from "../../api/bookApi";
import { getAllCategories } from "../../api/categoryApi";
import { useAuth } from "../../context/AuthContext";

import "bootstrap/dist/css/bootstrap.min.css";

const PAGE_SIZE = 8;

function Home() {
    const { user } = useAuth();

    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);

    // Ô nhập (chưa áp dụng cho tới khi bấm Search)
    const [keywordInput, setKeywordInput] = useState("");
    const [categoryInput, setCategoryInput] = useState("");
    // Bộ lọc đang áp dụng
    const [keyword, setKeyword] = useState("");
    const [categoryId, setCategoryId] = useState("");

    useEffect(() => {
        getAllCategories()
            .then((res) => setCategories(res.data || []))
            .catch(() => setCategories([]));
    }, []);

    useEffect(() => {
        loadBooks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, keyword, categoryId]);

    const loadBooks = async () => {
        try {
            setLoading(true);
            const res = await getBooks(page, PAGE_SIZE, keyword, categoryId);
            const data = res.data;
            setBooks(data.content || []);
            setTotalPages(data.totalPages || 0);
            setTotalElements(data.totalElements || 0);
        } catch (err) {
            setBooks([]);
            setTotalPages(0);
            setTotalElements(0);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(0);
        setKeyword(keywordInput.trim());
        setCategoryId(categoryInput);
    };

    const handleReset = () => {
        setKeywordInput("");
        setCategoryInput("");
        setKeyword("");
        setCategoryId("");
        setPage(0);
    };

    const statusBadge = (status) => {
        if (status === "AVAILABLE") return <span className="badge bg-success">Available</span>;
        if (status === "UNAVAILABLE") return <span className="badge bg-secondary">Unavailable</span>;
        return <span className="badge bg-light text-dark">{status || "-"}</span>;
    };

    // Danh sách số trang (cửa sổ tối đa 5 nút)
    const pageWindow = () => {
        if (totalPages <= 1) return [];
        const start = Math.max(0, Math.min(page - 2, totalPages - 5));
        const end = Math.min(totalPages, start + 5);
        const arr = [];
        for (let i = start; i < end; i++) arr.push(i);
        return arr;
    };

    return (
        <div className="container mt-4">
            {/* Hero */}
            <div className="p-4 mb-4 bg-light rounded-3 border">
                <h1 className="h3 mb-1">
                    <i className="bi bi-book me-2"></i>
                    Library Catalog
                </h1>
                <p className="text-muted mb-0">
                    {user
                        ? <>Welcome back, <strong>{user.fullName || user.username}</strong>! Browse the collection below.</>
                        : "Browse our collection of books. Sign in to borrow."}
                </p>
            </div>

            {/* Search + filter */}
            <form className="row g-2 align-items-end mb-4" onSubmit={handleSearch}>
                <div className="col-12 col-md-5">
                    <label className="form-label mb-1">Search</label>
                    <input
                        className="form-control"
                        placeholder="Title, author, ISBN..."
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                    />
                </div>
                <div className="col-8 col-md-4">
                    <label className="form-label mb-1">Category</label>
                    <select
                        className="form-select"
                        value={categoryInput}
                        onChange={(e) => setCategoryInput(e.target.value)}
                    >
                        <option value="">All categories</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>
                <div className="col-4 col-md-3 d-flex gap-2">
                    <button className="btn btn-primary flex-grow-1" type="submit">
                        <i className="bi bi-search me-1"></i>Search
                    </button>
                    <button className="btn btn-outline-secondary" type="button" onClick={handleReset}>
                        Reset
                    </button>
                </div>
            </form>

            {/* Kết quả */}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : books.length === 0 ? (
                <div className="alert alert-info">No books found.</div>
            ) : (
                <>
                    <p className="text-muted small">{totalElements} book(s) found</p>
                    <div className="row g-3">
                        {books.map((book) => (
                            <div className="col-12 col-sm-6 col-lg-3" key={book.id}>
                                <div className="card h-100 shadow-sm">
                                    <div className="card-body d-flex flex-column">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <span className="badge bg-info text-dark">{book.category || "Uncategorized"}</span>
                                            {statusBadge(book.status)}
                                        </div>
                                        <h5 className="card-title">{book.title}</h5>
                                        <h6 className="card-subtitle mb-2 text-muted">
                                            <i className="bi bi-person me-1"></i>{book.author || "Unknown"}
                                        </h6>
                                        {book.description && (
                                            <p className="card-text small text-muted flex-grow-1">
                                                {book.description.length > 90
                                                    ? book.description.slice(0, 90) + "..."
                                                    : book.description}
                                            </p>
                                        )}
                                        <ul className="list-unstyled small mb-0 mt-2">
                                            {book.publisher && <li><strong>Publisher:</strong> {book.publisher}</li>}
                                            {book.publishYear && <li><strong>Year:</strong> {book.publishYear}</li>}
                                            {book.price != null && (
                                                <li><strong>Price:</strong> {Number(book.price).toLocaleString()} đ</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <nav className="mt-4 d-flex justify-content-center">
                            <ul className="pagination mb-0">
                                <li className={`page-item ${page === 0 ? "disabled" : ""}`}>
                                    <button className="page-link" onClick={() => setPage(page - 1)}>Previous</button>
                                </li>
                                {pageWindow()[0] > 0 && (
                                    <li className="page-item disabled"><span className="page-link">...</span></li>
                                )}
                                {pageWindow().map((p) => (
                                    <li className={`page-item ${p === page ? "active" : ""}`} key={p}>
                                        <button className="page-link" onClick={() => setPage(p)}>{p + 1}</button>
                                    </li>
                                ))}
                                {pageWindow().slice(-1)[0] < totalPages - 1 && (
                                    <li className="page-item disabled"><span className="page-link">...</span></li>
                                )}
                                <li className={`page-item ${page >= totalPages - 1 ? "disabled" : ""}`}>
                                    <button className="page-link" onClick={() => setPage(page + 1)}>Next</button>
                                </li>
                            </ul>
                        </nav>
                    )}
                </>
            )}

            {!user && (
                <div className="text-center mt-5 pt-3 border-top">
                    <p className="text-muted mb-2">Want to borrow books?</p>
                    <Link to="/login" className="btn btn-primary me-2">Login</Link>
                    <Link to="/register" className="btn btn-outline-primary">Register</Link>
                </div>
            )}
        </div>
    );
}

export default Home;
