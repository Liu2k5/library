// src/components/common/Footer.jsx
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="row py-4">
                    <div className="col-md-4 mb-3 mb-md-0">
                        <h5>
                            <i className="bi bi-book me-2"></i>
                            Library Management System
                        </h5>
                        <p className="text-muted small">
                            A comprehensive library management system for modern libraries.
                        </p>
                    </div>
                    <div className="col-md-4 mb-3 mb-md-0">
                        <h6>Quick Links</h6>
                        <ul className="footer-links list-unstyled">
                            <li>
                                <a href="/membership" className="text-muted text-decoration-none">
                                    <i className="bi bi-chevron-right me-1"></i>
                                    Membership Plans
                                </a>
                            </li>
                            <li>
                                <a href="/login" className="text-muted text-decoration-none">
                                    <i className="bi bi-chevron-right me-1"></i>
                                    Login
                                </a>
                            </li>
                            <li>
                                <a href="/register" className="text-muted text-decoration-none">
                                    <i className="bi bi-chevron-right me-1"></i>
                                    Register
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="col-md-4">
                        <h6>Contact</h6>
                        <ul className="footer-links list-unstyled">
                            <li className="text-muted">
                                <i className="bi bi-envelope me-2"></i>
                                support@library.com
                            </li>
                            <li className="text-muted">
                                <i className="bi bi-telephone me-2"></i>
                                +84 123 456 789
                            </li>
                            <li className="text-muted">
                                <i className="bi bi-geo-alt me-2"></i>
                                Hanoi, Vietnam
                            </li>
                        </ul>
                        <div className="social-links mt-2">
                            <span className="text-muted me-3">
                                <i className="bi bi-facebook"></i>
                            </span>
                            <span className="text-muted me-3">
                                <i className="bi bi-twitter"></i>
                            </span>
                            <span className="text-muted me-3">
                                <i className="bi bi-youtube"></i>
                            </span>
                            <span className="text-muted">
                                <i className="bi bi-github"></i>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom text-center py-3 border-top">
                    <p className="text-muted small mb-0">
                        © {currentYear} Library Management System. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;