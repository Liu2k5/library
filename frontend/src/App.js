import logo from './logo.svg';
import './App.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";

import BookList from "./pages/librarian/BookList";
import BookForm from "./pages/librarian/BookForm";
import CategoryList from './pages/librarian/CategoryList';
import CategoryForm from './pages/librarian/CategoryForm';
import AuthorList from './pages/librarian/AuthorList';
import AuthorForm from './pages/librarian/AuthorForm';
import BookCopyList from "./pages/librarian/BookCopyList";
import BookCopyForm from "./pages/librarian/BookCopyForm";

function App() {
    return (
        <BrowserRouter>

            <Routes>
                <Route path="/librarian/books" element={<BookList />} />
                <Route path="/librarian/books/add" element={<BookForm />} />
                <Route path="/librarian/books/edit/:id" element={<BookForm />} />

                <Route path="/librarian/categories" element={<CategoryList />} />
                <Route path="/librarian/categories/add" element={<CategoryForm />} />
                <Route path="/librarian/categories/edit/:id" element={<CategoryForm />} />

                <Route path="/librarian/authors" element={<AuthorList />} />
                <Route path="/librarian/authors/add" element={<AuthorForm />} />
                <Route path="/librarian/authors/edit/:id" element={<AuthorForm />} />

                <Route path="/librarian/books/:bookId/copies" element={<BookCopyList />}/>
                <Route path="/librarian/books/:bookId/copies/add" element={<BookCopyForm />}/>
                <Route path="/librarian/bookcopies/edit/:id" element={<BookCopyForm />}/>
                
            </Routes>

        </BrowserRouter>

    );

}

export default App;
