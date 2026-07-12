import React, { useEffect, useState } from 'react';
import { notificationApi } from '../../api/notificationApi';
import './NotificationManage.css';

const NOTIFICATION_TYPES = ['INFO', 'SUCCESS', 'WARNING', 'FAILURE', 'ERROR'];

const EMPTY_FORM = {
  id: null,
  username: '',
  title: '',
  message: '',
  type: 'INFO',
  isRead: false,
};

const formatDate = (value) => {
  if (!value) return '—';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleString('vi-VN');
};

export default function NotificationManage() {
  const [notifications, setNotifications] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const loadAll = () => {
    setStatus('loading');
    notificationApi
      .getAll()
      .then((res) => {
        setNotifications(res.data || []);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  };

  useEffect(loadAll, []);

  const isEditing = form.id !== null;

  const resetForm = () => setForm(EMPTY_FORM);

  const handleEdit = (notification) => {
    setForm({
      id: notification.id,
      username: notification.user?.username ?? '',
      title: notification.title ?? '',
      message: notification.message ?? '',
      type: notification.type ?? 'INFO',
      isRead: !!notification.isRead,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setFormError('');

    const payload = {
      user: {
        username: form.username,
      },
      title: form.title,
      message: form.message,
      type: form.type,
      isRead: form.isRead,
    };

    try {
      if (isEditing) {
        await notificationApi.update(form.id, payload);

        alert('Cập nhật thông báo thành công.');
      } else {
        await notificationApi.create(payload);
      }

      resetForm();
      loadAll();
    } catch (err) {
      console.log(err.response?.data);

      if (err.response?.status === 404) {
        setFormError('Không tìm thấy user.');
      } else if (err.response?.status === 400) {
        setFormError(err.response.data.message);
      } else {
        setFormError('Không tìm thấy user tương ứng, vui lòng nhập lại');
      }
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Xoá thông báo này?')) return;

    try {
      await notificationApi.delete(id);

      alert('Xoá thông báo thành công.');

      loadAll();
    } catch (err) {
      setFormError('Không xoá được thông báo.');
    }
  };

  return (
    <section>
      <div className="notif-header">
        <span className="overall-eyebrow">Quản trị</span>
        <h2 className="overall-title">Notification manage</h2>
      </div>

      <form className="notif-form" onSubmit={handleSubmit}>
        <div className="notif-form-row">
          <label className="notif-field">
            <span>Username người nhận</span>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="vd: nguyenvana"
              required
              disabled={isEditing}
            />
          </label>
          <label className="notif-field">
            <span>Loại</span>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              {NOTIFICATION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="notif-field">
          <span>Tiêu đề</span>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Tiêu đề thông báo"
            required
          />
        </label>
        <label className="notif-field">
          <span>Nội dung</span>
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Nội dung thông báo"
            rows={3}
            required
          />
        </label>

        {formError && (
          <div className="alert alert-danger py-2 mb-2">
            {formError}
          </div>
        )}
        <div className="notif-form-actions">
          <button type="submit" className="notif-btn-primary" disabled={saving}>
            {saving ? 'Đang lưu…' : isEditing ? 'Cập nhật' : 'Tạo thông báo'}
          </button>
          {isEditing && (
            <button type="button" className="notif-btn-ghost" onClick={resetForm}>
              Huỷ
            </button>
          )}
        </div>
      </form>

      {status === 'error' && (
        <p className="overall-error">Không tải được danh sách thông báo.</p>
      )}

      {status === 'loading' && <p className="notif-empty">Đang tải…</p>}

      {status === 'ready' && notifications.length === 0 && (
        <p className="notif-empty">Chưa có thông báo nào.</p>
      )}

      {status === 'ready' && notifications.length > 0 && (
        <ul className="notif-list">
          {notifications.map((n) => (
            <li key={n.id} className={`notif-row ${n.isRead ? 'is-read' : ''}`}>
              <div className="notif-row-main">
                <div className="notif-row-top">
                  <span className={`notif-badge badge-${(n.type || 'INFO').toLowerCase()}`}>
                    {n.type || 'INFO'}
                  </span>
                  <span className="notif-row-title">{n.title}</span>
                  {!n.isRead && <span className="notif-unread-dot" title="Chưa đọc" />}
                </div>
                <span className="notif-row-content">{n.message}</span>
                <span className="notif-row-meta">
                  Tới: {n.user?.username ?? '—'} · {formatDate(n.createdAt)}
                </span>
              </div>
              <div className="notif-row-actions">
                <button type="button" onClick={() => handleEdit(n)}>
                  Sửa
                </button>
                <button
                  type="button"
                  className="notif-row-delete"
                  onClick={() => handleDelete(n.id)}
                >
                  Xoá
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
