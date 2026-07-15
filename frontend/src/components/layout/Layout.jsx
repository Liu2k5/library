// src/components/layout/Layout.js
import { Outlet } from 'react-router-dom';
import Footer from '../common/Footer';
import Navbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';
import './Layout.css';

const Layout = () => {
    return (
        <div className="layout-wrapper">
            <Navbar />
            <div className="layout-body">
                <Sidebar />
                <main className="layout-content">
                    <Outlet />
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default Layout;