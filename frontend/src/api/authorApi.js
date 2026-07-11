// src/api/authorApi.js
import axiosInstance from './axiosConfig';

const API = axiosInstance;

export const getAuthors = (page, size, keyword = "") =>
    API.get(`/librarian/authors?page=${page}&size=${size}&keyword=${keyword}`);

export const getAllAuthors = () =>
    API.get("/librarian/authors/all");

export const getAuthor = (id) =>
    API.get(`/librarian/authors/${id}`);

export const createAuthor = (author) =>
    API.post("/librarian/authors", author);

export const updateAuthor = (id, author) =>
    API.put(`/librarian/authors/${id}`, author);

export const deleteAuthor = (id) =>
    API.delete(`/librarian/authors/${id}`);