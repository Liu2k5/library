import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { changeStatus, getBooks } from "../../api/bookApi";
import { getCategories } from "../../api/categoryApi";

function BookList() {

    const navigate = useNavigate();

    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [keyword, setKeyword] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [status, setStatus] = useState("");

    useEffect(() => {
        loadBooks();
    }, [page]);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const res = await getCategories(0, 100);
            setCategories(res.data.content);
        } catch (err) {
            console.log(err);
        }
    };

    const loadBooks = async () => {
        try {
            const res = await getBooks(
                page,
                10,
                keyword,
                categoryId,
                status
            );
            setBooks(res.data.content);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.log(err);
        }

    };

    const handleStatus = async (id) => {
        if (!window.confirm("Change book status?"))
            return;

        await changeStatus(id);
        loadBooks();
    };

    const handleReset = async () => {
        setKeyword("");
        setCategoryId("");
        setStatus("");
        setPage(0);

        const res = await getBooks(0, 10, "", "", "");

        setBooks(res.data.content);
        setTotalPages(res.data.totalPages);
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="mb-0">Book Management</h3>
                <div>
                    <button
                        className="btn btn-outline-primary me-2"
                        onClick={() => navigate("/librarian/categories")}
                    >
                        Manage Categories
                    </button>
                    <button
                        className="btn btn-outline-primary me-2"
                        onClick={() => navigate("/librarian/authors")}
                    >
                        Manage Authors
                    </button>
                    <button
                        className="btn btn-success"
                        onClick={() => navigate("/librarian/books/add")}
                    >
                        Add Book
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="row mb-3">
                <div className="col-md-4">
                    <input
                        className="form-control"
                        placeholder="Search title or ISBN"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>
                <div className="col-md-3">
                    <select
                        className="form-select"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {
                            categories.map(category => (
                                <option
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.name}
                                </option>
                            ))
                        }
                    </select>
                </div>
                <div className="col-md-2">
                    <select
                        className="form-select"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="AVAILABLE">
                            Available
                        </option>
                        <option value="UNAVAILABLE">
                            Unavailable
                        </option>
                    </select>
                </div>
                <div className="col-md-3">
                    <button
                        className="btn btn-primary me-2"
                        onClick={() => {
                            setPage(0);
                            loadBooks();
                        }}
                    >
                        Search
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={handleReset}
                    >
                        Reset
                    </button>
                </div>
            </div>
            <table className="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Publisher</th>
                        <th>Year</th>
                        <th>Status</th>
                        <th width="250">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        books.map(book => (
                            <tr key={book.id}>
                                <td>{book.id}</td>
                                <td>{book.title}</td>
                                <td>{book.author}</td>
                                <td>{book.category}</td>
                                <td>{book.price}</td>
                                <td>{book.publisher}</td>
                                <td>{book.publishYear}</td>
                                <td>
                                    <span
                                        className={`badge ${book.status === "AVAILABLE"
                                            ? "bg-success"
                                            : "bg-danger"
                                            }`}
                                    >
                                        {book.status}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => navigate(`/librarian/books/edit/${book.id}`)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-primary btn-sm me-2"
                                        onClick={() => navigate(`/librarian/books/${book.id}/copies`)}
                                    >
                                        Copies
                                    </button>
                                    <button
                                        className={`btn btn-sm ${book.status === "AVAILABLE"
                                            ? "btn-danger"
                                            : "btn-success"
                                            }`}
                                        onClick={() => handleStatus(book.id)}
                                    >
                                        {
                                            book.status === "AVAILABLE"
                                                ? "Disable"
                                                : "Enable"
                                        }
                                    </button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            <div>
                {
                    [...Array(totalPages)].map((_, index) => (
                        <button
                            key={index}
                            className={`btn ${page === index
                                ? "btn-primary"
                                : "btn-outline-primary"
                                } me-2`}
                            onClick={() => setPage(index)}
                        >
                            {index + 1}
                        </button>
                    ))
                }
            </div>
        </div>
    );
}

export default BookList;