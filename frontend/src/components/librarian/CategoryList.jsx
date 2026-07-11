import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteCategory, getCategories } from "../../api/categoryApi";

import "bootstrap/dist/css/bootstrap.min.css";

function CategoryList() {

    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [keyword, setKeyword] = useState("");

    useEffect(() => {
        loadCategories(page, keyword);
    }, [page]);

    const loadCategories = async (
        currentPage = page,
        currentKeyword = keyword
    ) => {
        const res = await getCategories(
            currentPage,
            10,
            currentKeyword
        );
        setCategories(res.data.content);
        setTotalPages(res.data.totalPages);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this category?"))
            return;
        await deleteCategory(id);
        loadCategories();
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between mb-3">
                <h3>Category Management</h3>
                <div>
                    <button
                        className="btn btn-secondary me-2"
                        onClick={() => navigate("/librarian/books")}
                    >
                        Back
                    </button>
                    <button
                        className="btn btn-success"
                        onClick={() => navigate("/librarian/categories/add")}
                    >
                        Add Category
                    </button>
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-md-4">
                    <input
                        className="form-control"
                        placeholder="Search category..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>
                <div className="col-md-3">
                    <button
                        className="btn btn-primary me-2"
                        onClick={() => {
                            setPage(0);
                            loadCategories(0, keyword);
                        }}
                    >
                        Search
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={() => {
                            setKeyword("");
                            setPage(0);
                            loadCategories(0, "");
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
                        <th>Description</th>
                        <th width="180">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        categories.map(category => (
                            <tr key={category.id}>
                                <td>{category.id}</td>
                                <td>{category.name}</td>
                                <td>{category.description}</td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => navigate(`/librarian/categories/edit/${category.id}`)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(category.id)}
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

export default CategoryList;