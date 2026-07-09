import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8080/librarian"
});

export const getAuthors = (
    page,
    size,
    keyword = ""
) =>
    API.get(
        `/authors?page=${page}&size=${size}&keyword=${keyword}`
    );

export const getAllAuthors = () =>
    API.get("/authors/all");

export const getAuthor = (id) =>
    API.get(`/authors/${id}`);

export const createAuthor = (author) =>
    API.post("/authors", author);

export const updateAuthor = (id, author) =>
    API.put(`/authors/${id}`, author);

export const deleteAuthor = (id) =>
    API.delete(`/authors/${id}`);