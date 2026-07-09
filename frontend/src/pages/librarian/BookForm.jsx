import { useEffect, useState } from "react";
import { createBook, getBook, updateBook } from "../../../src/api/bookApi";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { getAllCategories } from "../../../src/api/categoryApi";
import { getAllAuthors } from "../../../src/api/authorApi";
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

    const [categories, setCategories] = useState([]);

    const [authors, setAuthors] = useState([]);

    useEffect(() => {

        loadCategories();
        loadAuthors();

        if (isEdit) {
            loadBook();
        }

    }, []);

    const loadCategories = async () => {

        const res = await getAllCategories();

        setCategories(
            res.data.map(c => ({
                value: c.id,
                label: c.name
            }))
        );

    }

    const loadAuthors = async () => {

        const res = await getAllAuthors();

        setAuthors(
            res.data.map(a => ({
                value: a.id,
                label: a.name
            }))
        );

    }

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

        navigate("/librarian/books");

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

                    <label className="form-label">

                        Category

                    </label>

                    <div className="d-flex">

                        <div className="flex-grow-1">

                            <Select

                                options={categories}

                                placeholder="Select category..."

                                value={
                                    categories.find(
                                        c => c.value === book.categoryId
                                    )
                                }

                                onChange={(selected) =>
                                    setBook({
                                        ...book,
                                        categoryId: selected.value
                                    })
                                }

                                isSearchable

                            />

                        </div>

                        <button

                            type="button"

                            className="btn btn-outline-primary ms-2"

                            onClick={() => navigate("/librarian/categories")}

                        >

                            Manage

                        </button>

                    </div>

                </div>

                <div className="mb-3">

                    <label className="form-label">

                        Author

                    </label>

                    <div className="d-flex">

                        <div className="flex-grow-1">

                            <Select

                                options={authors}

                                placeholder="Select author..."

                                value={
                                    authors.find(
                                        a => a.value === book.authorId
                                    )
                                }

                                onChange={(selected) =>
                                    setBook({
                                        ...book,
                                        authorId: selected.value
                                    })
                                }

                                isSearchable

                            />

                        </div>

                        <button

                            type="button"

                            className="btn btn-outline-primary ms-2"

                            onClick={() => navigate("/librarian/authors")}

                        >

                            Manage

                        </button>

                    </div>

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

                <div className="mt-3">

                    <button
                        type="submit"
                        className="btn btn-success me-2"
                    >
                        Save
                    </button>

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate("/librarian/books")}
                    >
                        Cancel
                    </button>

                </div>

            </form>

        </div>

    );

}

export default BookForm;