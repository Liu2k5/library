// src/components/common/Navbar.jsx
import { NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    <i className="bi bi-book me-2"></i>
                    Library Management
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    {isAuthenticated ? (
                        <>
                            <ul className="navbar-nav me-auto">
                                {/* Librarian Menu - React Bootstrap NavDropdown */}
                                {(user?.role === 'ADMIN' || user?.role === 'LIBRARIAN') && (
                                    <li className="nav-item">
                                        <NavDropdown
                                            title={
                                                <span className="text-white">
                                                    <i className="bi bi-book me-1"></i>
                                                    Books
                                                </span>
                                            }
                                            id="librarianDropdown"
                                        >
                                            <NavDropdown.Item as={Link} to="/librarian/books">
                                                <i className="bi bi-list me-1"></i>
                                                All Books
                                            </NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/librarian/books/add">
                                                <i className="bi bi-plus-circle me-1"></i>
                                                Add Book
                                            </NavDropdown.Item>
                                            <NavDropdown.Divider />
                                            <NavDropdown.Item as={Link} to="/librarian/authors">
                                                <i className="bi bi-person me-1"></i>
                                                Authors
                                            </NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/librarian/categories">
                                                <i className="bi bi-tags me-1"></i>
                                                Categories
                                            </NavDropdown.Item>
                                        </NavDropdown>
                                    </li>
                                )}

                                {/* Admin Menu */}
                                {user?.role === 'ADMIN' && (
                                    <li className="nav-item">
                                        <Link className="nav-link text-white" to="/admin">
                                            <i className="bi bi-gear me-1"></i>
                                            Admin Panel
                                        </Link>
                                    </li>
                                )}
                            </ul>

                            {/* Account Dropdown */}
                            <NavDropdown
                                title={
                                    <span className="text-white">
                                        <i className="bi bi-person-circle me-1"></i>
                                        {user?.fullName || user?.username}
                                        <span className="badge bg-light text-dark ms-2">
                                            {user?.role}
                                        </span>
                                    </span>
                                }
                                id="accountDropdown"
                                align="end"
                                style={{ color: 'white' }}
                            >
                                <NavDropdown.Item as={Link} to="/profile">
                                    <i className="bi bi-person me-2"></i>
                                    Profile
                                </NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/change-password">
                                    <i className="bi bi-key me-2"></i>
                                    Change Password
                                </NavDropdown.Item>
                            </NavDropdown>

                            {/* Logout button outside dropdown */}
                            <button
                                onClick={handleLogout}
                                className="btn btn-outline-light btn-sm ms-3"
                            >
                                <i className="bi bi-box-arrow-right me-1"></i>
                                Logout
                            </button>
                        </>
                    ) : (
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">
                                    <i className="bi bi-box-arrow-in-right me-1"></i>
                                    Login
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/register">
                                    <i className="bi bi-person-plus me-1"></i>
                                    Register
                                </Link>
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;