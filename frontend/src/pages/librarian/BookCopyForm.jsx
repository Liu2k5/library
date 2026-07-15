import { useEffect, useState } from "react";

import {
    createBookCopy,
    getBookCopy,
    updateBookCopy
} from "../../api/bookCopyApi";

import { useNavigate, useParams } from "react-router-dom";

function BookCopyForm() {

    const navigate = useNavigate();

    const { id, bookId } = useParams();

    const isEdit = id != null;

    const [copy, setCopy] = useState({

        barcode: "",
        location: ""

    });

    useEffect(() => {

        if (isEdit) {

            loadCopy();

        }

    }, []);

    const loadCopy = async () => {

        const res = await getBookCopy(id);

        setCopy(res.data);

    }

    const handleChange = (e) => {

        setCopy({

            ...copy,
            [e.target.name]: e.target.value

        });

    }

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (isEdit) {

            await updateBookCopy(id, copy);

            navigate(`/librarian/books/${copy.bookId}/copies`);

        } else {

            await createBookCopy(bookId, copy);

            navigate(`/librarian/books/${bookId}/copies`);

        }

    }

    return (

        <div className="container mt-4">

            <h3>

                {isEdit ? "Edit Copy" : "Add Copy"}

            </h3>

            <form onSubmit={handleSubmit}>

                <div className="mb-3">

                    <label>Barcode</label>

                    <input

                        className="form-control"

                        name="barcode"

                        value={copy.barcode}

                        onChange={handleChange}

                    />

                </div>

                <div className="mb-3">

                    <label>Location</label>

                    <input

                        className="form-control"

                        name="location"

                        value={copy.location}

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
                        onClick={() => {

                            if (isEdit) {

                                navigate(`/librarian/books/${copy.bookId}/copies`);

                            } else {

                                navigate(`/librarian/books/${bookId}/copies`);

                            }

                        }}
                    >
                        Cancel
                    </button>

                </div>

            </form>

        </div>

    )

}

export default BookCopyForm;