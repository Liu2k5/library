// src/components/common/Sidebar.jsx
// src/components/common/Sidebar.jsx
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
    const location = useLocation();
    const { isAuthenticated } = useAuth();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user?.role || 'MEMBER';

    // Determine which section we're in
    const isLibrarianSection = location.pathname.startsWith('/librarian');
    const isAdminSection = location.pathname.startsWith('/admin');
    const isProfileSection = location.pathname.startsWith('/profile') ||
        location.pathname.startsWith('/change-password') ||
        location.pathname.startsWith('/membership') ||
        location.pathname.startsWith('/payment') ||
        location.pathname.startsWith('/ai-chat');

    // If not in any special section, hide sidebar
    if (!isLibrarianSection && !isAdminSection && !isProfileSection) {
        return null;
    }

    return (
        <nav className="sidebar-nav">
            <ul className="sidebar-menu">
                {/* Show only Librarian menu when in librarian section */}
                {isLibrarianSection && role === 'LIBRARIAN' && (
                    <li className="sidebar-section">
                        <span className="sidebar-section-title">Librarian Panel</span>
                        <ul className="sidebar-submenu">
                            <li>
                                <NavLink
                                    to="/librarian/books"
                                    className={({ isActive }) => isActive ? 'active' : ''}
                                    end
                                >
                                    <i className="bi bi-book"></i>
                                    <span>All Books</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/librarian/authors"
                                    className={({ isActive }) => isActive ? 'active' : ''}
                                >
                                    <i className="bi bi-person"></i>
                                    <span>Authors</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/librarian/categories"
                                    className={({ isActive }) => isActive ? 'active' : ''}
                                >
                                    <i className="bi bi-tags"></i>
                                    <span>Categories</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/librarian/borrows"
                                    className={({ isActive }) => isActive ? 'active' : ''}
                                >
                                    <i className="bi bi-journal-plus"></i>
                                    <span>Create Borrow Record</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/librarian/returns"
                                    className={({ isActive }) => isActive ? 'active' : ''}
                                >
                                    <i className="bi bi-journal-arrow-up"></i>
                                    <span>Payment</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/librarian/fines"
                                    className={({ isActive }) => isActive ? 'active' : ''}
                                >
                                    <i className="bi bi-cash-coin"></i>
                                    <span>Fines</span>
                                </NavLink>
                            </li>
                        </ul>
                    </li>
                )}

                {/* Show only Admin menu when in admin section */}
                {isAdminSection && role === 'ADMIN' && (
                    <li className="sidebar-section">
                        <span className="sidebar-section-title">Admin Panel</span>
                        <ul className="sidebar-submenu">
                            <li>
                                <NavLink
                                    to="/admin/overall"
                                    className={({ isActive }) => isActive ? 'active' : ''}
                                    end
                                >
                                    <i className="bi bi-bar-chart"></i>
                                    <span>Overall</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/admin/accounts"
                                    className={({ isActive }) => isActive ? 'active' : ''}
                                >
                                    <i className="bi bi-people"></i>
                                    <span>Account Manager</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/admin/memberships"
                                    className={({ isActive }) => isActive ? 'active' : ''}
                                >
                                    <i className="bi bi-ticket"></i>
                                    <span>Membership Manager</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/admin/notifications"
                                    className={({ isActive }) => isActive ? 'active' : ''}
                                >
                                    <i className="bi bi-bell"></i>
                                    <span>Notification Manager</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/admin/vector-db"
                                    className={({ isActive }) => isActive ? 'active' : ''}
                                >
                                    <i className="bi bi-database-gear"></i>
                                    <span>Vector DB Manager</span>
                                </NavLink>
                            </li>
                        </ul>
                    </li>
                )}

                {/* Membership Section always show instead of admin and librarian */}
                {isProfileSection && user.role !== "ADMIN" && user.role !== "LIBRARIAN" && (
                    <li className="sidebar-section">
                        <span className="sidebar-section-title">Membership</span>
                        <ul className="sidebar-submenu">
                            <li>
                                <NavLink
                                    to="/membership"
                                    className={({ isActive }) => isActive ? 'active' : ''}
                                    end
                                >
                                    <i className="bi bi-ticket-perforated"></i>
                                    <span>Membership Plans</span>
                                </NavLink>
                            </li>
                        </ul>
                    </li>
                )}

                {/* AI Assistant Section */}
                {isProfileSection && (
                    <li className="sidebar-section">
                        <span className="sidebar-section-title">AI Assistant</span>
                        <ul className="sidebar-submenu">
                            <li>
                                <NavLink
                                    to="/ai-chat"
                                    className={({ isActive }) => isActive ? 'active' : ''}
                                    end
                                >
                                    <i className="bi bi-robot"></i>
                                    <span>AI Chatbot</span>
                                </NavLink>
                            </li>
                        </ul>
                    </li>
                )}

                {/* Account Section only show when logged in */}
                {isProfileSection && isAuthenticated && (
                    <li className="sidebar-section">
                        <span className="sidebar-section-title">Account</span>
                        <ul className="sidebar-submenu">
                            <li>
                                <NavLink
                                    to="/profile"
                                    className={({ isActive }) => isActive ? 'active' : ''}
                                    end
                                >
                                    <i className="bi bi-person"></i>
                                    <span>My Profile</span>
                                </NavLink>
                            </li>
                            {user.role === "MEMBER" && (
                                <li>
                                    <NavLink
                                        to="/payment/history"
                                        className={({ isActive }) => isActive ? 'active' : ''}
                                    >
                                        <i className="bi bi-credit-card"></i>
                                        <span>Payment History</span>
                                    </NavLink>
                                </li>
                            )}
                            <li>
                                <NavLink
                                    to="/change-password"
                                    className={({ isActive }) => isActive ? 'active' : ''}
                                >
                                    <i className="bi bi-key"></i>
                                    <span>Change Password</span>
                                </NavLink>
                            </li>
                        </ul>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Sidebar;