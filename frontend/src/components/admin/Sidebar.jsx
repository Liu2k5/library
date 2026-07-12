import React from 'react';
import './Sidebar.css';

const NAV_ITEMS = [
  { key: 'overall', label: 'Overall', tag: '01', hint: 'Doanh thu · Người dùng · Sách' },
  { key: 'notifications', label: 'Notification manage', tag: '02', hint: 'Quản lý thông báo' },
  { key: 'memberships', label: 'Membership manage', tag: '03', hint: 'Quản lý membership type' },
  { key: 'accounts', label: 'Account manage', tag: '04', hint: 'Quản lý tài khoản' },
];

export default function Sidebar({ activeTab, onSelect }) {
  return (
    <nav className="sidebar" aria-label="Điều hướng quản trị">
      <div className="sidebar-label">Mục lục</div>
      <ul className="sidebar-list">
        {NAV_ITEMS.map((item) => (
          <li key={item.key}>
            <button
              type="button"
              className={`sidebar-item ${activeTab === item.key ? 'is-active' : ''}`}
              onClick={() => onSelect(item.key)}
              aria-current={activeTab === item.key ? 'page' : undefined}
            >
              <span className="sidebar-tag">{item.tag}</span>
              <span className="sidebar-text">
                <span className="sidebar-title">{item.label}</span>
                <span className="sidebar-hint">{item.hint}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
