// src/App.js
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import PrivateRoute from './components/common/PrivateRoute';
import Layout from './components/layout/Layout';
import { AuthProvider, useAuth } from './context/AuthContext';

// Authentication Components
import ChangePassword from './components/auth/ChangePassword';
import ForgotPassword from './components/auth/ForgotPassword';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ResetPassword from './components/auth/ResetPassword';
import Profile from './components/profile/Profile';

// Librarian Components
import AuthorForm from './pages/librarian/AuthorForm';
import AuthorList from './pages/librarian/AuthorList';
import BookCopyForm from "./pages/librarian/BookCopyForm";
import BookCopyList from "./pages/librarian/BookCopyList";
import BookForm from "./pages/librarian/BookForm";
import BookList from "./pages/librarian/BookList";
import CategoryForm from './pages/librarian/CategoryForm';
import CategoryList from './pages/librarian/CategoryList';

// Home Component
const Home = () => {
    const { user } = useAuth();
    return (
        <div className="container mt-5">
            <div className="jumbotron bg-light p-5 rounded">
                <h1 className="display-4">Library Management System</h1>
                <p className="lead">
                    {user ? (
                        <>Welcome back, <strong>{user.fullName || user.username}</strong>!</>
                    ) : (
                        'Welcome to Library Management System'
                    )}
                </p>
                <hr className="my-4" />
                <p>
                    This is a comprehensive library management system for managing books,
                    borrowings, and user accounts.
                </p>
                {!user && (
                    <div className="mt-4">
                        <a href="/login" className="btn btn-primary me-2">Login</a>
                        <a href="/register" className="btn btn-outline-primary">Register</a>
                    </div>
                )}
            </div>
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public Routes with Layout */}
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="login" element={<Login />} />
                        <Route path="register" element={<Register />} />
                        <Route path="forgot-password" element={<ForgotPassword />} />
                        <Route path="reset-password" element={<ResetPassword />} />

                        {/* Protected Routes */}
                        <Route
                            path="profile"
                            element={
                                <PrivateRoute>
                                    <Profile />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="change-password"
                            element={
                                <PrivateRoute>
                                    <ChangePassword />
                                </PrivateRoute>
                            }
                        />

                        {/* Librarian Routes - Protected */}
                        <Route
                            path="librarian/*"
                            element={
                                <PrivateRoute roles={['ADMIN', 'LIBRARIAN']}>
                                    <Routes>
                                        <Route path="books" element={<BookList />} />
                                        <Route path="books/add" element={<BookForm />} />
                                        <Route path="books/edit/:id" element={<BookForm />} />

                                        <Route path="categories" element={<CategoryList />} />
                                        <Route path="categories/add" element={<CategoryForm />} />
                                        <Route path="categories/edit/:id" element={<CategoryForm />} />

                                        <Route path="authors" element={<AuthorList />} />
                                        <Route path="authors/add" element={<AuthorForm />} />
                                        <Route path="authors/edit/:id" element={<AuthorForm />} />

                                        <Route path="books/:bookId/copies" element={<BookCopyList />} />
                                        <Route path="books/:bookId/copies/add" element={<BookCopyForm />} />
                                        <Route path="bookcopies/edit/:id" element={<BookCopyForm />} />
                                    </Routes>
                                </PrivateRoute>
                            }
                        />

                        {/* Admin Routes - Protected */}
                        <Route
                            path="admin/*"
                            element={
                                <PrivateRoute roles={['ADMIN']}>
                                    <div className="container mt-5">
                                        <h1>Admin Panel</h1>
                                        <p>Admin dashboard coming soon...</p>
                                    </div>
                                </PrivateRoute>
                            }
                        />

                        {/* Catch all - redirect to home */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;