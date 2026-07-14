// src/components/common/Sidebar.jsx
import { NavLink, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user?.role || 'MEMBER';

    // Determine which section we're in
    const isLibrarianSection = location.pathname.startsWith('/librarian');
    const isAdminSection = location.pathname.startsWith('/admin');
    const isProfileSection = location.pathname.startsWith('/profile') || location.pathname.startsWith('/change-password');

    // If not in any special section, hide sidebar
    if (!isLibrarianSection && !isAdminSection && !isProfileSection) {
        return null;
    }

    return (
        <nav className="sidebar-nav">
            <ul className="sidebar-menu">
                {/* Show only Librarian menu when in librarian section */}
                {isLibrarianSection && (role === 'ADMIN' || role === 'LIBRARIAN') && (
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
                        </ul>
                    </li>
                )}

                {/* Show only Profile menu when in profile section */}
                {isProfileSection && (
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