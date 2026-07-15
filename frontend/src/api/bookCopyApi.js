import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8080/librarian"
});

export const getBookCopies = (bookId, page, size) =>
    API.get(`/books/${bookId}/copies?page=${page}&size=${size}`);

export const getBookCopy = (id) =>
    API.get(`/bookcopies/${id}`);

export const createBookCopy = (bookId, copy) =>
    API.post(`/books/${bookId}/copies`, copy);

export const updateBookCopy = (id, copy) =>
    API.put(`/bookcopies/${id}`, copy);

export const changeStatus = (id) =>
    API.patch(`/bookcopies/${id}/status`);