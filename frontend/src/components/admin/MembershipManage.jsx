import { useEffect, useState } from 'react';
import { membershipApi } from '../../api/membershipApi';
import './AdminStyles.css';

const EMPTY_FORM = {
    id: null,
    name: '',
    price: '',
    borrowLimit: '',
    borrowDurationDay: '',
    description: '',
    userStatus: 'ACTIVE',
};

export default function MembershipManage() {
    const [memberships, setMemberships] = useState([]);
    const [status, setStatus] = useState('loading');
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState('');

    const loadAll = () => {
        setStatus('loading');
        membershipApi
            .getAll()
            .then((res) => {
                setMemberships(res.data || []);
                setStatus('ready');
            })
            .catch(() => setStatus('error'));
    };

    useEffect(loadAll, []);

    const isEditing = form.id !== null;
    const resetForm = () => setForm(EMPTY_FORM);

    const handleEdit = (membership) => {
        setForm({
            id: membership.id,
            name: membership.name ?? '',
            price: membership.price ?? '',
            borrowLimit: membership.borrowLimit ?? '',
            borrowDurationDay: membership.borrowDurationDay ?? '',
            description: membership.description ?? '',
            userStatus: membership.userStatus ?? 'ACTIVE',
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setFormError('');

        const payload = {
            name: form.name,
            price: Number(form.price),
            borrowLimit: Number(form.borrowLimit),
            borrowDurationDay: Number(form.borrowDurationDay),
            description: form.description,
            userStatus: form.userStatus,
        };

        try {
            if (isEditing) {
                await membershipApi.update(form.id, payload);
                alert('Membership updated successfully.');
            } else {
                await membershipApi.create(payload);
                alert('Membership created successfully.');
            }
            resetForm();
            loadAll();
        } catch (err) {
            setFormError('An error occurred.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this membership?')) return;
        try {
            await membershipApi.delete(id);
            alert('Membership deleted successfully.');
            loadAll();
        } catch (err) {
            setFormError('Failed to delete membership.');
        }
    };

    return (
        <div className="admin-page">
            <div className="page-header">
                <h2>Membership Management</h2>
                <p className="text-muted">Manage membership plans and their benefits</p>
            </div>

            <div className="admin-card">
                <div className="card-header">
                    <h5>{isEditing ? 'Edit Membership' : 'Create New Membership'}</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Price</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={form.price}
                                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Borrow Limit</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={form.borrowLimit}
                                    onChange={(e) => setForm({ ...form, borrowLimit: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Borrow Duration (days)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={form.borrowDurationDay}
                                    onChange={(e) => setForm({ ...form, borrowDurationDay: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group full-width">
                                <label>Description</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                />
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

            {status === 'error' && <div className="alert alert-danger">Failed to load memberships.</div>}
            {status === 'loading' && <div className="text-center py-4">Loading...</div>}
            {status === 'ready' && (
                <div className="admin-card">
                    <div className="card-header">
                        <h5>Memberships List</h5>
                        <span className="badge bg-primary">{memberships.length} memberships</span>
                    </div>
                    <div className="card-body p-0">
                        <div className="list-group list-group-flush">
                            {memberships.length === 0 ? (
                                <div className="text-center py-4 text-muted">No memberships found.</div>
                            ) : (
                                memberships.map((m) => (
                                    <div key={m.id} className="list-group-item">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div className="flex-grow-1">
                                                <h6 className="mb-1">{m.name}</h6>
                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <small className="text-muted">Price: ${m.price}</small>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <small className="text-muted">Borrow Limit: {m.borrowLimit}</small>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <small className="text-muted">Duration: {m.borrowDurationDay} days</small>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <span className={`badge bg-${m.userStatus === 'ACTIVE' ? 'success' : 'warning'}`}>
                                                            {m.userStatus}
                                                        </span>
                                                    </div>
                                                </div>
                                                {m.description && <small className="text-muted d-block mt-1">{m.description}</small>}
                                            </div>
                                            <div>
                                                <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(m)}>
                                                    Edit
                                                </button>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(m.id)}>
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