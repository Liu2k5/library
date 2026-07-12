import axiosInstance from "./axiosConfig";

const API = axiosInstance

export const getCategories = (page, size, keyword = "") =>
    API.get(`/librarian/categories?page=${page}&size=${size}&keyword=${keyword}`);

export const getAllCategories = () =>
    API.get("/librarian/categories/all");

export const getCategory = (id) =>
    API.get(`/librarian/categories/${id}`);

export const createCategory = (category) =>
    API.post("/librarian/categories", category);

export const updateCategory = (id, category) =>
    API.put(`/librarian/categories/${id}`, category);

export const deleteCategory = (id) =>
    API.delete(`/librarian/categories/${id}`);