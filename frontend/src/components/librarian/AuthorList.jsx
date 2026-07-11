import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteAuthor, getAuthors } from "../../api/authorApi";

import "bootstrap/dist/css/bootstrap.min.css";

function AuthorList() {

    const navigate = useNavigate();
    const [authors, setAuthors] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [keyword, setKeyword] = useState("");

    useEffect(() => {
        loadAuthors(page, keyword);
    }, [page]);

    const loadAuthors = async (
        currentPage = page,
        currentKeyword = keyword
    ) => {
        const res = await getAuthors(
            currentPage,
            10,
            currentKeyword
        );
        setAuthors(res.data.content);
        setTotalPages(res.data.totalPages);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this author?"))
            return;
        await deleteAuthor(id);
        loadAuthors();
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between mb-3">
                <h3>Author Management</h3>
                <div>
                    <button
                        className="btn btn-secondary me-2"
                        onClick={() => navigate("/librarian/books")}
                    >
                        Back
                    </button>
                    <button
                        className="btn btn-success"
                        onClick={() => navigate("/librarian/authors/add")}
                    >
                        Add Author
                    </button>
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-md-4">
                    <input
                        className="form-control"
                        placeholder="Search author..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>
                <div className="col-md-3">
                    <button
                        className="btn btn-primary me-2"
                        onClick={() => {
                            setPage(0);
                            loadAuthors(0, keyword);
                        }}
                    >
                        Search
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={() => {
                            setKeyword("");
                            setPage(0);

                            loadAuthors(0, "");
                        }}
                    >
                        Reset
                    </button>
                </div>
            </div>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Biography</th>
                        <th width="180">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        authors.map(author => (
                            <tr key={author.id}>
                                <td>{author.id}</td>
                                <td>{author.name}</td>
                                <td>{author.biography}</td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => navigate(`/librarian/authors/edit/${author.id}`)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(author.id)}
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

export default AuthorList;