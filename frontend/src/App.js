import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./components/admin/pages/Dashboard";
import BookList from "./components/librarian/BookList";
import BookForm from "./components/librarian/BookForm";
import CategoryList from './components/librarian/CategoryList';
import CategoryForm from './components/librarian/CategoryForm';
import AuthorList from './components/librarian/AuthorList';
import AuthorForm from './components/librarian/AuthorForm';
import BookCopyList from "./components/librarian/BookCopyList";
import BookCopyForm from "./components/librarian/BookCopyForm";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/register" element={<Register />} />

      <Route path="/librarian/books" element={<BookList />} />
      <Route path="/librarian/books/add" element={<BookForm />} />
      <Route path="/librarian/books/edit/:id" element={<BookForm />} />

      <Route path="/librarian/categories" element={<CategoryList />} />
      <Route path="/librarian/categories/add" element={<CategoryForm />} />
      <Route path="/librarian/categories/edit/:id" element={<CategoryForm />} />

      <Route path="/librarian/authors" element={<AuthorList />} />
      <Route path="/librarian/authors/add" element={<AuthorForm />} />
      <Route path="/librarian/authors/edit/:id" element={<AuthorForm />} />

      <Route path="/librarian/books/:bookId/copies" element={<BookCopyList />} />
      <Route path="/librarian/books/:bookId/copies/add" element={<BookCopyForm />} />
      <Route path="/librarian/bookcopies/edit/:id" element={<BookCopyForm />} />
    </Routes>
  );
}

export default App;