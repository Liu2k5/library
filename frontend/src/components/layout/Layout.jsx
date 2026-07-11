// src/components/layout/Layout.js
import { Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar';

const Layout = () => {
    return (
        <div>
            <Navbar />
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;