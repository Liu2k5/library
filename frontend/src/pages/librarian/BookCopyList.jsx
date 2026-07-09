import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getBookCopies,
    changeStatus
} from "../../api/bookCopyApi";

import "bootstrap/dist/css/bootstrap.min.css";

function BookCopyList() {

    const { bookId } = useParams();

    const navigate = useNavigate();

    const [copies, setCopies] = useState([]);

    const [page, setPage] = useState(0);

    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {

        loadCopies();

    }, [page]);

    const loadCopies = async () => {

        const res = await getBookCopies(bookId, page, 10);

        setCopies(res.data.content);

        setTotalPages(res.data.totalPages);

    }

    const handleStatus = async (id) => {

        if (!window.confirm("Change status?"))
            return;

        await changeStatus(id);

        loadCopies();

    }

    return (

        <div className="container mt-4">

            <div className="d-flex justify-content-between mb-3">

                <h3>Book Copies</h3>

                <div>

                    <button
                        className="btn btn-secondary me-2"
                        onClick={() => navigate("/librarian/books")}
                    >
                        Back
                    </button>

                    <button
                        className="btn btn-success"
                        onClick={() => navigate(`/librarian/books/${bookId}/copies/add`)}
                    >
                        Add Copy
                    </button>

                </div>

            </div>

            <table className="table table-bordered table-hover">

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>Barcode</th>

                        <th>Location</th>

                        <th>Status</th>

                        <th width="220">Action</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        copies.map(copy => (

                            <tr key={copy.id}>

                                <td>{copy.id}</td>

                                <td>{copy.barcode}</td>

                                <td>{copy.location}</td>

                                <td>

                                    <span
                                        className={`badge ${copy.status === "AVAILABLE"
                                            ? "bg-success"
                                            : copy.status === "BORROWED"
                                                ? "bg-warning text-dark"
                                                : "bg-danger"
                                            }`}
                                    >

                                        {copy.status}

                                    </span>

                                </td>

                                <td>

                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => navigate(`/librarian/bookcopies/edit/${copy.id}`)}
                                    >
                                        Edit
                                    </button>

                                    {
                                        copy.status !== "BORROWED" &&

                                        <button
                                            className={`btn btn-sm ${copy.status === "AVAILABLE"
                                                ? "btn-danger"
                                                : "btn-success"
                                                }`}
                                            onClick={() => handleStatus(copy.id)}
                                        >

                                            {
                                                copy.status === "AVAILABLE"
                                                    ? "Disable"
                                                    : "Enable"
                                            }

                                        </button>

                                    }

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

    )

}

export default BookCopyList;