import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8080/librarian/books",
    headers: {
        "Content-Type": "application/json",
    }
});

export const getBooks = (page, size) =>
    API.get("", {
        params: {
            page,
            size
        }
    });

export const getBook = (id) =>
    API.get(`/${id}`);

export const createBook = (book) =>
    API.post("", book);

export const updateBook = (id, book) =>
    API.put(`/${id}`, book);

export const deleteBook = (id) =>
    API.delete(`/${id}`);