import { useEffect, useState } from 'react';
import { notificationApi } from '../../api/notificationApi';
import { accountApi } from '../../api/accountApi';
import './AdminStyles.css';

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
    return Number.isNaN(d.getTime()) ? '—' : d.toLocaleString();
};

export default function NotificationManage() {
    const [notifications, setNotifications] = useState([]);
    const [status, setStatus] = useState('loading');
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState('');
    const [users, setUsers] = useState([]);

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

    useEffect(() => {
        loadAll();

        accountApi
            .getAll()
            .then((res) => setUsers(res.data || []))
            .catch(() => setUsers([]));
    }, []);

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
            user: { username: form.username },
            title: form.title,
            message: form.message,
            type: form.type,
            isRead: form.isRead,
        };

        try {
            if (isEditing) {
                await notificationApi.update(form.id, payload);
                alert('Notification updated successfully.');
            } else {
                await notificationApi.create(payload);
                alert('Notification created successfully.');
            }
            resetForm();
            loadAll();
        } catch (err) {
            setFormError(err.response?.data?.message || 'An error occurred.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this notification?')) return;
        try {
            await notificationApi.delete(id);
            alert('Notification deleted successfully.');
            loadAll();
        } catch (err) {
            setFormError('Failed to delete notification.');
        }
    };

    return (
        <div className="admin-page">
            <div className="page-header">
                <h2>Notification Management</h2>
                <p className="text-muted">Manage system notifications for users</p>
            </div>

            <div className="admin-card">
                <div className="card-header">
                    <h5>{isEditing ? 'Edit Notification' : 'Create New Notification'}</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Recipient User</label>
                                <select
                                    className="form-control"
                                    value={form.username}
                                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                                    required
                                    disabled={isEditing}
                                >
                                    <option value="">-- Select User --</option>

                                    {users.map((user) => (
                                        <option
                                            key={user.username}
                                            value={user.username}
                                        >
                                            {user.fullName} ({user.username})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Type</label>
                                <select
                                    className="form-control"
                                    value={form.type}
                                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                                >
                                    {NOTIFICATION_TYPES.map((t) => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group full-width">
                                <label>Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    placeholder="Notification title"
                                    required
                                />
                            </div>
                            <div className="form-group full-width">
                                <label>Message</label>
                                <textarea
                                    className="form-control"
                                    value={form.message}
                                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                                    placeholder="Notification content"
                                    rows="3"
                                    required
                                />
                            </div>
                        </div>
                        {formError && <div className="alert alert-danger">{formError}</div>}
                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary" disabled={saving}>
                                {saving ? 'Saving...' : isEditing ? 'Update' : 'Create'}
                            </button>
                            {isEditing && (
                                <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            {status === 'error' && <div className="alert alert-danger">Failed to load notifications.</div>}
            {status === 'loading' && <div className="text-center py-4">Loading...</div>}
            {status === 'ready' && (
                <div className="admin-card">
                    <div className="card-header">
                        <h5>Notifications List</h5>
                        <span className="badge bg-primary">{notifications.length} notifications</span>
                    </div>
                    <div className="card-body p-0">
                        <div className="list-group list-group-flush">
                            {notifications.length === 0 ? (
                                <div className="text-center py-4 text-muted">No notifications found.</div>
                            ) : (
                                notifications.map((n) => (
                                    <div key={n.id} className={`list-group-item ${!n.isRead ? 'list-group-item-light' : ''}`}>
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div className="flex-grow-1">
                                                <div className="d-flex align-items-center gap-2">
                                                    <span className={`badge bg-${n.type === 'ERROR' ? 'danger' : n.type === 'SUCCESS' ? 'success' : n.type === 'WARNING' ? 'warning' : n.type === 'FAILURE' ? 'danger' : 'info'}`}>
                                                        {n.type || 'INFO'}
                                                    </span>
                                                    <h6 className="mb-0">{n.title}</h6>
                                                    {!n.isRead && <span className="badge bg-primary">New</span>}
                                                </div>
                                                <p className="mb-1 mt-2">{n.message}</p>
                                                <small className="text-muted">
                                                    To: {n.user?.username || '—'} · {formatDate(n.createdAt)}
                                                </small>
                                            </div>
                                            <div>
                                                <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(n)}>
                                                    Edit
                                                </button>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(n.id)}>
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}