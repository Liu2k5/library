import { useEffect, useState } from 'react';
import { accountApi } from '../../api/accountApi';
import './AdminStyles.css';

const EMPTY_FORM = {
    username: '',
    fullName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    role: '',
    userStatus: 'ACTIVE',
};

export default function AccountManage() {
    const [accounts, setAccounts] = useState([]);
    const [status, setStatus] = useState('loading');
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const loadAll = () => {
        setStatus('loading');
        accountApi
            .getAll()
            .then((res) => {
                setAccounts(res.data || []);
                setStatus('ready');
            })
            .catch(() => setStatus('error'));
    };

    useEffect(loadAll, []);

    const resetForm = () => {
        setForm(EMPTY_FORM);
        setIsEditing(false);
        setFormError('');
    };

    const handleEdit = (user) => {
        setIsEditing(true);
        setForm({
            username: user.username ?? '',
            fullName: user.fullName ?? '',
            email: user.email ?? '',
            password: '',
            phone: user.phone ?? '',
            address: user.address ?? '',
            role: user.role?.name ?? '',
            userStatus: user.userStatus ?? 'ACTIVE',
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setFormError('');

        try {
            if (isEditing) {
                await accountApi.update(form.username, {
                    userStatus: form.userStatus,
                });
                alert('Account updated successfully.');
            } else {
                await accountApi.create({
                    username: form.username,
                    fullName: form.fullName,
                    email: form.email,
                    password: form.password,
                    phone: form.phone,
                    address: form.address,
                    role: { name: form.role },
                    userStatus: form.userStatus,
                });
                alert('Account created successfully.');
            }
            resetForm();
            loadAll();
        } catch (err) {
            setFormError(err.response?.data?.message || 'An error occurred.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="admin-page">
            <div className="page-header">
                <h2>Account Management</h2>
                <p className="text-muted">Manage user accounts and their roles</p>
            </div>

            <div className="admin-card">
                <div className="card-header">
                    <h5>{isEditing ? 'Edit Account' : 'Create New Account'}</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={form.username}
                                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                                    required
                                    disabled={isEditing}
                                />
                            </div>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={form.fullName}
                                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                                    disabled={isEditing}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    disabled={isEditing}
                                    required
                                />
                            </div>
                            {!isEditing && (
                                <div className="form-group">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        required
                                    />
                                </div>
                            )}
                            <div className="form-group">
                                <label>Phone</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    disabled={isEditing}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Address</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={form.address}
                                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                                    disabled={isEditing}
                                />
                            </div>
                            <div className="form-group">
                                <label>Role</label>
                                <select
                                    className="form-control"
                                    value={form.role}
                                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                                    disabled={isEditing}
                                >
                                    <option value="MEMBER">MEMBER</option>
                                    <option value="VIP">VIP</option>
                                    <option value="LIBRARIAN">LIBRARIAN</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <select
                                    className="form-control"
                                    value={form.userStatus}
                                    onChange={(e) => setForm({ ...form, userStatus: e.target.value })}
                                >
                                    <option value="ACTIVE">ACTIVE</option>
                                    <option value="INACTIVE">INACTIVE</option>
                                    <option value="BANNED">BANNED</option>
                                </select>
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

            {status === 'error' && <div className="alert alert-danger">Failed to load accounts.</div>}
            {status === 'loading' && <div className="text-center py-4">Loading...</div>}
            {status === 'ready' && (
                <div className="admin-card">
                    <div className="card-header">
                        <h5>Accounts List</h5>
                        <span className="badge bg-primary">{accounts.length} accounts</span>
                    </div>
                    <div className="card-body p-0">
                        <div className="list-group list-group-flush">
                            {accounts.length === 0 ? (
                                <div className="text-center py-4 text-muted">No accounts found.</div>
                            ) : (
                                accounts.map((u) => (
                                    <div key={u.username} className="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="mb-1">{u.fullName}</h6>
                                            <small className="text-muted">
                                                @{u.username} · {u.email} · {u.role?.name}
                                            </small>
                                            <br />
                                            <span className={`badge bg-${u.userStatus === 'ACTIVE' ? 'success' : u.userStatus === 'BANNED' ? 'danger' : 'warning'}`}>
                                                {u.userStatus}
                                            </span>
                                        </div>
                                        <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(u)}>
                                            Edit
                                        </button>
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