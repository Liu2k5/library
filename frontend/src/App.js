// src/App.js
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import PrivateRoute from './components/common/PrivateRoute';
import Layout from './components/layout/Layout';
import Home from './components/home/Home';
import { AuthProvider } from './context/AuthContext';
import { MembershipProvider } from './context/MembershipContext';

// Authentication Components
import ChangePassword from './components/auth/ChangePassword';
import ForgotPassword from './components/auth/ForgotPassword';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ResetPassword from './components/auth/ResetPassword';
import Profile from './components/profile/Profile';

// Librarian Components
import AuthorForm from './components/librarian/AuthorForm';
import AuthorList from './components/librarian/AuthorList';
import BookCopyForm from "./components/librarian/BookCopyForm";
import BookCopyList from "./components/librarian/BookCopyList";
import BookForm from "./components/librarian/BookForm";
import BookList from "./components/librarian/BookList";
import CategoryForm from './components/librarian/CategoryForm';
import CategoryList from './components/librarian/CategoryList';
import BorrowForm from './components/librarian/BorrowForm';
import ReturnBook from './components/librarian/ReturnBook';
import FineList from './components/librarian/FineList';

// Admin Components
import AccountManage from './components/admin/AccountManage';
import MembershipManage from './components/admin/MembershipManage';
import NotificationManage from './components/admin/NotificationManage';
import Overall from './components/admin/Overall';
import VectorDbManage from './components/admin/VectorDbManage';

// AI Chatbot
import AiChatbot from './components/chatbot/AiChatbot';

// Membership Components
import MembershipPage from './components/membership/MembershipPage';
import PaymentCancel from './components/payment/PaymentCancel';
import PaymentHistory from './components/payment/PaymentHistoryPage';
import PaymentSuccess from './components/payment/PaymentSuccess';

function App() {
    return (
        <AuthProvider>
            <MembershipProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route index element={<Home />} />
                            <Route path="login" element={<Login />} />
                            <Route path="register" element={<Register />} />
                            <Route path="forgot-password" element={<ForgotPassword />} />
                            <Route path="reset-password" element={<ResetPassword />} />

                            {/* Membership - Public route (can view plans) */}
                            <Route path="membership" element={<MembershipPage />} />

                            {/* AI Chatbot - public route */}
                            <Route path="ai-chat" element={<AiChatbot />} />

                            {/* Payment routes */}
                            <Route path="payment/success" element={<PaymentSuccess />} />
                            <Route path="payment/cancel" element={<PaymentCancel />} />

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
                            <Route
                                path="payment/history"
                                element={
                                    <PrivateRoute>
                                        <PaymentHistory />
                                    </PrivateRoute>
                                }
                            />

                            {/* Librarian Routes */}
                            <Route
                                path="librarian/*"
                                element={
                                    <PrivateRoute roles={'LIBRARIAN'}>
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
                                            <Route path="borrows" element={<BorrowForm />} />
                                            <Route path="returns" element={<ReturnBook />} />
                                            <Route path="fines" element={<FineList />} />
                                        </Routes>
                                    </PrivateRoute>
                                }
                            />

                            {/* Admin Routes */}
                            <Route
                                path="admin/*"
                                element={
                                    <PrivateRoute roles={['ADMIN']}>
                                        <Routes>
                                            <Route path="overall" element={<Overall />} />
                                            <Route path="accounts" element={<AccountManage />} />
                                            <Route path="memberships" element={<MembershipManage />} />
                                            <Route path="notifications" element={<NotificationManage />} />
                                            <Route path="vector-db" element={<VectorDbManage />} />
                                        </Routes>
                                    </PrivateRoute>
                                }
                            />

                            {/* Catch all - redirect to home */}
                            <Route path="*" element={<Navigate to="/" />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </MembershipProvider>
        </AuthProvider>
    );
}

export default App;