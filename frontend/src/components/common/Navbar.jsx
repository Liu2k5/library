// src/components/common/Navbar.jsx
// src/components/common/Navbar.jsx
import { NavDropdown } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const isLibrarianActive = location.pathname.startsWith('/librarian');
    const isAdminActive = location.pathname.startsWith('/admin');
    const isProfileActive = [
        '/profile',
        '/payment/history',
        '/change-password',
    ].some(path => location.pathname.startsWith(path));

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
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
                    <ul className="navbar-nav me-auto">
                        {/* AI Chatbot - Luôn hiển thị */}
                        <li className="nav-item">
                            <Link
                                className={`nav-link text-white ${location.pathname === '/ai-chat' ? 'active' : ''}`}
                                to="/ai-chat"
                            >
                                <i className="bi bi-robot me-1"></i>
                                AI Chat
                            </Link>
                        </li>

                        {/* Membership Menu - Luôn hiển thị */}
                        <li className="nav-item">
                            <Link
                                className={`nav-link text-white ${location.pathname === '/membership' ? 'active' : ''}`}
                                to="/membership"
                            >
                                <i className="bi bi-ticket-perforated me-1"></i>
                                Membership
                            </Link>
                        </li>

                        {/* Các menu chỉ hiển thị khi đã đăng nhập */}
                        {isAuthenticated && (
                            <>
                                {/* Librarian Menu */}
                                {(user?.role === 'LIBRARIAN') && (
                                    <li className="nav-item">
                                        <NavDropdown
                                            title={
                                                <span className="text-white">
                                                    <i className="bi bi-book me-1"></i>
                                                    Librarian Panel
                                                </span>
                                            }
                                            id="librarianDropdown"
                                        >
                                            <NavDropdown.Item as={Link} to="/librarian/books" active={isLibrarianActive && location.pathname === '/librarian/books'}>
                                                <i className="bi bi-list me-1"></i>
                                                All Books
                                            </NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/librarian/authors" active={isLibrarianActive && location.pathname === '/librarian/authors'}>
                                                <i className="bi bi-person me-1"></i>
                                                Authors
                                            </NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/librarian/categories" active={isLibrarianActive && location.pathname === '/librarian/categories'}>
                                                <i className="bi bi-tags me-1"></i>
                                                Categories
                                            </NavDropdown.Item>
                                            <NavDropdown.Divider />
                                            <NavDropdown.Item as={Link} to="/librarian/borrows" active={location.pathname === '/librarian/borrows'}>
                                                <i className="bi bi-journal-plus me-1"></i>
                                                Create Borrow Record
                                            </NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/librarian/returns" active={location.pathname === '/librarian/returns'}>
                                                <i className="bi bi-journal-arrow-up me-1"></i>
                                                Return Books
                                            </NavDropdown.Item>
                                        </NavDropdown>
                                    </li>
                                )}

                                {/* Admin Menu */}
                                {user?.role === 'ADMIN' && (
                                    <li className="nav-item">
                                        <NavDropdown
                                            title={
                                                <span className="text-white">
                                                    <i className="bi bi-gear me-1"></i>
                                                    Admin Panel
                                                </span>
                                            }
                                            id="adminDropdown"
                                        >
                                            <NavDropdown.Item as={Link} to="/admin/overall" active={isAdminActive && location.pathname === '/admin/overall'}>
                                                <i className="bi bi-bar-chart me-1"></i>
                                                Overall
                                            </NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/admin/accounts" active={isAdminActive && location.pathname === '/admin/accounts'}>
                                                <i className="bi bi-people me-1"></i>
                                                Account Manager
                                            </NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/admin/memberships" active={isAdminActive && location.pathname === '/admin/memberships'}>
                                                <i className="bi bi-ticket me-1"></i>
                                                Membership Manager
                                            </NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/admin/notifications" active={isAdminActive && location.pathname === '/admin/notifications'}>
                                                <i className="bi bi-bell me-1"></i>
                                                Notification Manager
                                            </NavDropdown.Item>
                                        </NavDropdown>
                                    </li>
                                )}
                            </>
                        )}
                    </ul>

                    {isAuthenticated ? (
                        <>
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
                                <NavDropdown.Item as={Link} to="/profile" active={isProfileActive && location.pathname === '/profile'}>
                                    <i className="bi bi-person me-2"></i>
                                    Profile
                                </NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/payment/history" active={isProfileActive && location.pathname === '/payment/history'}>
                                    <i className="bi bi-credit-card me-2"></i>
                                    Payment History
                                </NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/change-password" active={isProfileActive && location.pathname === '/change-password'}>
                                    <i className="bi bi-key me-2"></i>
                                    Change Password
                                </NavDropdown.Item>
                            </NavDropdown>

                            {/* Logout button */}
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