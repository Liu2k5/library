import React, { useEffect, useState } from 'react';
import { membershipApi } from '../../api/membershipApi';
import './MembershipManage.css';

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
  const [status, setStatus] = useState('loading'); // loading | ready | error
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

        alert('Cập nhật gói membership thành công.');
      } else {
        await membershipApi.create(payload);

        alert('Tạo gói membership thành công.');
      }

      resetForm();
      loadAll();
    } catch (err) {
      console.log(err.response?.data);
      setFormError('Có lỗi xảy ra.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xoá gói membership này?')) return;

    try {
      await membershipApi.delete(id);

      alert('Xoá gói membership thành công.');

      loadAll();
    } catch (err) {
      setFormError('Không xoá được gói membership.');
    }
  };

  return (
    <section>
      <div className="notif-header">
        <span className="overall-eyebrow">Quản trị</span>
        <h2 className="overall-title">Membership manage</h2>
      </div>

      <form className="notif-form" onSubmit={handleSubmit}>
        <div className="notif-form-row">
          <label className="notif-field">
            <span>Tên gói</span>
            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              required
            />
          </label>

          <label className="notif-field">
            <span>Giá</span>
            <input
              type="number"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
              required
            />
          </label>
        </div>

        <div className="notif-form-row">
          <label className="notif-field">
            <span>Borrow limit</span>
            <input
              type="number"
              value={form.borrowLimit}
              onChange={(e) =>
                setForm({
                  ...form,
                  borrowLimit: e.target.value,
                })
              }
              required
            />
          </label>

          <label className="notif-field">
            <span>Borrow duration (day)</span>
            <input
              type="number"
              value={form.borrowDurationDay}
              onChange={(e) =>
                setForm({
                  ...form,
                  borrowDurationDay: e.target.value,
                })
              }
              required
            />
          </label>
        </div>

        <label className="notif-field">
          <span>Description</span>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
          />
        </label>

        <label className="notif-field">
          <span>User status</span>
          <select
            value={form.userStatus}
            onChange={(e) =>
              setForm({
                ...form,
                userStatus: e.target.value,
              })
            }
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="BANNED">BANNED</option>
          </select>
        </label>

        {formError && (
          <div className="alert alert-danger py-2 mb-2">
            {formError}
          </div>
        )}

        <div className="notif-form-actions">
          <button
            type="submit"
            className="notif-btn-primary"
            disabled={saving}
          >
            {saving
              ? 'Đang lưu…'
              : isEditing
              ? 'Cập nhật'
              : 'Tạo membership'}
          </button>

          {isEditing && (
            <button
              type="button"
              className="notif-btn-ghost"
              onClick={resetForm}
            >
              Huỷ
            </button>
          )}
        </div>
      </form>

      {status === 'error' && (
        <p className="overall-error">
          Không tải được danh sách membership.
        </p>
      )}

      {status === 'loading' && (
        <p className="notif-empty">Đang tải…</p>
      )}

      {status === 'ready' && memberships.length === 0 && (
        <p className="notif-empty">
          Chưa có membership nào.
        </p>
      )}

      {status === 'ready' && memberships.length > 0 && (
        <ul className="notif-list">
          {memberships.map((m) => (
            <li key={m.id} className="notif-row">
              <div className="notif-row-main">
                <div className="notif-row-top">
                  <span className="notif-row-title">
                    {m.name}
                  </span>
                </div>

                <span className="notif-row-content">
                  Price: {m.price}
                </span>

                <span className="notif-row-content">
                  Borrow limit: {m.borrowLimit}
                </span>

                <span className="notif-row-content">
                  Borrow duration: {m.borrowDurationDay} ngày
                </span>

                <span className="notif-row-content">
                  {m.description}
                </span>

                <span className="notif-row-meta">
                  Status: {m.userStatus}
                </span>
              </div>

              <div className="notif-row-actions">
                <button
                  type="button"
                  onClick={() => handleEdit(m)}
                >
                  Sửa
                </button>

                <button
                  type="button"
                  className="notif-row-delete"
                  onClick={() => handleDelete(m.id)}
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