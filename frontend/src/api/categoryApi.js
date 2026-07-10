import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8080/librarian"
});

export const getCategories = (
    page,
    size,
    keyword = ""
) =>
    API.get(
        `/categories?page=${page}&size=${size}&keyword=${keyword}`
    );

export const getAllCategories = () =>
    API.get("/categories/all");

export const getCategory = (id) =>
    API.get(`/categories/${id}`);

export const createCategory = (category) =>
    API.post("/categories", category);

export const updateCategory = (id, category) =>
    API.put(`/categories/${id}`, category);

export const deleteCategory = (id) =>
    API.delete(`/categories/${id}`);