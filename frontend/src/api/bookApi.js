// src/api/bookApi.js
import axiosInstance from './axiosConfig';

const API = axiosInstance;

export const getBooks = (page, size, keyword = "", categoryId = "") =>
    API.get(
        `/librarian/books?page=${page}&size=${size}&keyword=${encodeURIComponent(keyword)}` +
        (categoryId ? `&categoryId=${categoryId}` : "")
    );

export const getBook = (id) =>
    API.get(`/librarian/books/${id}`);

export const createBook = (book) =>
    API.post("/librarian/books", book);

export const updateBook = (id, book) =>
    API.put(`/librarian/books/${id}`, book);

export const changeStatus = (id) =>
    API.put(`/librarian/books/${id}/status`)