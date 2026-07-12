import React, { useEffect, useState } from 'react';
import { dashboardApi } from '../../api/dashboardApi';
import './Overall.css';

const todayStamp = new Date().toLocaleDateString('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const formatCurrency = (value) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value ?? 0);

const formatNumber = (value) => new Intl.NumberFormat('vi-VN').format(value ?? 0);

export default function Overall() {
  const [stats, setStats] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready | error

  useEffect(() => {
    let isMounted = true;
    dashboardApi
      .getOverall()
      .then((res) => {
        if (isMounted) {
          setStats(res.data);
          setStatus('ready');
        }
      })
      .catch(() => {
        if (isMounted) setStatus('error');
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const cards = [
    {
      key: 'revenue',
      label: 'Doanh thu',
      value: stats ? formatCurrency(stats.revenue) : '—',
      accent: 'green',
    },
    {
      key: 'users',
      label: 'Số người dùng',
      value: stats ? formatNumber(stats.userCount) : '—',
      accent: 'brass',
    },
    {
      key: 'librarians',
      label: 'Số thủ thư',
      value: stats ? formatNumber(stats.librarianCount) : '—',
      accent: 'ink',
    },
    {
      key: 'books',
      label: 'Số sách hiện có',
      value: stats ? formatNumber(stats.bookCount) : '—',
      accent: 'red',
    },
  ];

  return (
    <section>
      <div className="overall-header">
        <span className="overall-eyebrow">Tổng quan</span>
        <h2 className="overall-title">Overall</h2>
      </div>

      {status === 'error' && (
        <p className="overall-error">
          Chưa lấy được số liệu
        </p>
      )}

      <div className="overall-grid">
        {cards.map((card) => (
          <article key={card.key} className={`index-card accent-${card.accent}`}>
            <div className="index-card-stamp">{todayStamp}</div>
            <span className="index-card-label">{card.label}</span>
            <span className="index-card-value">
              {status === 'loading' ? '···' : card.value}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
