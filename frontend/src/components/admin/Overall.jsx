import { useEffect, useState } from 'react';
import { dashboardApi } from '../../api/dashboardApi';
import './AdminStyles.css';

const formatCurrency = (value) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value ?? 0);

const formatNumber = (value) => new Intl.NumberFormat('vi-VN').format(value ?? 0);

export default function Overall() {
    const [stats, setStats] = useState(null);
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        dashboardApi
            .getOverall()
            .then((res) => {
                setStats(res.data);
                setStatus('ready');
            })
            .catch(() => setStatus('error'));
    }, []);

    const cards = [
        { key: 'revenue', label: 'Revenue', value: stats?.revenue ? formatCurrency(stats.revenue) : '—', icon: 'bi-currency-dollar' },
        { key: 'users', label: 'Total Users', value: stats?.userCount ? formatNumber(stats.userCount) : '—', icon: 'bi-people' },
        { key: 'librarians', label: 'Librarians', value: stats?.librarianCount ? formatNumber(stats.librarianCount) : '—', icon: 'bi-person-badge' },
        { key: 'books', label: 'Total Books', value: stats?.bookCount ? formatNumber(stats.bookCount) : '—', icon: 'bi-book' },
    ];

    return (
        <div className="admin-page">
            <div className="page-header">
                <h2>Dashboard Overview</h2>
                <p className="text-muted">Real-time statistics and metrics</p>
            </div>

            {status === 'error' && (
                <div className="alert alert-danger">Failed to load dashboard data.</div>
            )}

            <div className="stats-grid">
                {cards.map((card) => (
                    <div key={card.key} className="stat-card">
                        <div className="stat-icon">
                            <i className={`bi ${card.icon}`}></i>
                        </div>
                        <div className="stat-content">
                            <h6 className="stat-label">{card.label}</h6>
                            <h3 className="stat-value">
                                {status === 'loading' ? '...' : card.value}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}