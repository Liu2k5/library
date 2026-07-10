import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8080/librarian",
    headers: {
        "Content-Type": "application/json",
    }
});

export const getBooks = (page, size, keyword = "", categoryId = "", status = "") =>
    API.get("/books", {
        params: {
            page,
            size,
            keyword,
            categoryId,
            status
        }
    });

export const getBook = (id) =>
    API.get(`/books/${id}`);

export const createBook = (book) =>
    API.post("/books", book);

export const updateBook = (id, book) =>
    API.put(`/books/${id}`, book);

export const changeStatus = (id) =>
    API.put(`/books/${id}/status`);