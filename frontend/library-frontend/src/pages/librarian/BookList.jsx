import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteBook, getBooks } from "../../api/bookApi";
import 'bootstrap/dist/css/bootstrap.min.css';

function BookList() {

    const navigate = useNavigate();

    const [books, setBooks] = useState([]);

    const [page, setPage] = useState(0);

    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        loadBooks();
    }, [page]);

    const loadBooks = async () => {

        try {

            const res = await getBooks(page, 10);

            setBooks(res.data.content);

            setTotalPages(res.data.totalPages);

        } catch (err) {

            console.log(err);

        }

    }

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this book?"))
            return;

        await deleteBook(id);

        loadBooks();

    }

    return (

        <div className="container mt-4">

            <div className="d-flex justify-content-between mb-3">

                <h3>Book Management</h3>

                <button
                    className="btn btn-success"
                    onClick={() => navigate("/books/add")}
                >
                    Add Book
                </button>

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

                                <td>{book.status}</td>

                                <td>

                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => navigate(`/books/edit/${book.id}`)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="btn btn-primary btn-sm me-2"
                                        onClick={() => navigate(`/bookcopies/${book.id}`)}
                                    >
                                        Add Copy
                                    </button>

                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(book.id)}
                                    >
                                        Delete
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

                            className={`btn ${page == index ? "btn-primary" : "btn-light"} me-2`}

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