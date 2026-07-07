import { useEffect, useState } from "react";
import { createBook, getBook, updateBook } from "../../api/bookApi";
import { useNavigate, useParams } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function BookForm() {

    const navigate = useNavigate();

    const { id } = useParams();

    const isEdit = id != null;

    const [book, setBook] = useState({

        title: "",

        categoryId: "",

        authorId: "",

        price: "",

        isbn: "",

        publisher: "",

        publishYear: "",

        description: ""

    });

    useEffect(() => {

        if (isEdit)

            loadBook();

    }, []);

    const loadBook = async () => {

        const res = await getBook(id);

        setBook(res.data);

    }

    const handleChange = (e) => {

        setBook({

            ...book,

            [e.target.name]: e.target.value

        });

    }

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (isEdit)

            await updateBook(id, book);

        else

            await createBook(book);

        navigate("/books");

    }

    return (

        <div className="container mt-4">

            <h3>

                {isEdit ? "Edit Book" : "Add Book"}

            </h3>

            <form onSubmit={handleSubmit}>

                <div className="mb-3">

                    <label>Title</label>

                    <input

                        className="form-control"

                        name="title"

                        value={book.title}

                        onChange={handleChange}

                    />

                </div>

                <div className="mb-3">

                    <label>Category Id</label>

                    <input

                        className="form-control"

                        name="categoryId"

                        value={book.categoryId}

                        onChange={handleChange}

                    />

                </div>

                <div className="mb-3">

                    <label>Author Id</label>

                    <input

                        className="form-control"

                        name="authorId"

                        value={book.authorId}

                        onChange={handleChange}

                    />

                </div>

                <div className="mb-3">

                    <label>Price</label>

                    <input

                        className="form-control"

                        name="price"

                        value={book.price}

                        onChange={handleChange}

                    />

                </div>

                <div className="mb-3">

                    <label>ISBN</label>

                    <input

                        className="form-control"

                        name="isbn"

                        value={book.isbn}

                        onChange={handleChange}

                    />

                </div>

                <div className="mb-3">

                    <label>Publisher</label>

                    <input

                        className="form-control"

                        name="publisher"

                        value={book.publisher}

                        onChange={handleChange}

                    />

                </div>

                <div className="mb-3">

                    <label>Publish Year</label>

                    <input

                        className="form-control"

                        name="publishYear"

                        value={book.publishYear}

                        onChange={handleChange}

                    />

                </div>

                <div className="mb-3">

                    <label>Description</label>

                    <textarea

                        className="form-control"

                        name="description"

                        value={book.description}

                        onChange={handleChange}

                    />

                </div>

                <button className="btn btn-success">

                    Save

                </button>

            </form>

        </div>

    );

}

export default BookForm;