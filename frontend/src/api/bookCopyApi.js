import axiosInstance from "./axiosConfig";

const API = axiosInstance;

export const getBookCopies = (bookId, page, size) =>
    API.get(`/librarian/books/${bookId}/copies?page=${page}&size=${size}`);

export const getBookCopy = (id) =>
    API.get(`/librarian/bookcopies/${id}`);

export const createBookCopy = (bookId, copy) =>
    API.post(`/librarian/books/${bookId}/copies`, copy);

export const updateBookCopy = (id, copy) =>
    API.put(`/librarian/bookcopies/${id}`, copy);

export const changeStatus = (id) =>
    API.patch(`/librarian/bookcopies/${id}/status`);