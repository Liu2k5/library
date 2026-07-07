import logo from './logo.svg';
import './App.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";

import BookList from "./pages/librarian/BookList";
import BookForm from "./pages/librarian/BookForm";

function App() {
    return (
        <BrowserRouter>

            <Routes>

                <Route path="/librarian/books" element={<BookList/>} />

                <Route path="/librarian/books/add" element={<BookForm/>} />

                <Route path="/librarian/books/edit/:id" element={<BookForm/>} />

            </Routes>

        </BrowserRouter>

    );

}

export default App;
