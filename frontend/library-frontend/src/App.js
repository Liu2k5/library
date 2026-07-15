import logo from './logo.svg';
import './App.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";

import BookList from "./pages/librarian/BookList";
import BookForm from "./pages/librarian/BookForm";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route path="/books" element={<BookList/>} />

                <Route path="/books/add" element={<BookForm/>} />

                <Route path="/books/edit/:id" element={<BookForm/>} />

            </Routes>

        </BrowserRouter>

    );

}

export default App;
