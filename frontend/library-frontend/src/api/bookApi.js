import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    }
});

export const getBooks = (page, size) =>
    API.get(`/books?page=${page}&size=${size}`);

export const getBook = (id) =>
    API.get(`/books/${id}`);

export const createBook = (book) =>
    API.post("/books", book);

export const updateBook = (id, book) =>
    API.put(`/books/${id}`, book);

export const deleteBook = (id) =>
    API.delete(`/books/${id}`);