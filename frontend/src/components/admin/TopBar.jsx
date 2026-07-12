import React from 'react';
import './TopBar.css';

// User entity: id = username (String), tên hiển thị thật là fullName.
function getDisplayName(user) {
  return user?.fullName || user?.username || user?.email || 'Admin';
}

function getInitials(user) {
  return (user?.fullName || '?')
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export default function TopBar({ user, loading, onLogout }) {
  const displayName = getDisplayName(user);
  const initials = getInitials(user);

  return (
    <header className="topbar">
      <div className="topbar-greeting">
        <span className="topbar-eyebrow">Hello Admin</span>
        <h1 className="topbar-name">{loading ? 'Đang tải…' : displayName}</h1>
      </div>

      <div className="topbar-actions">
        <div className="topbar-avatar" title={displayName}>
          {loading ? '··' : initials}
        </div>
        <button type="button" className="topbar-logout" onClick={onLogout}>
          Đăng xuất
        </button>
      </div>
    </header>
  );
}