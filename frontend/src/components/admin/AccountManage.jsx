import React, { useEffect, useState } from 'react';
import { accountApi } from '../../api/accountApi';
import './AccountManage.css';

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

        alert('Cập nhật tài khoản thành công.');
      } else {
        await accountApi.create({
          username: form.username,
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          phone: form.phone,
          address: form.address,
          role: {
            name: form.role,
          },
          userStatus: form.userStatus,
        });

        alert('Tạo tài khoản thành công.');
      }

      resetForm();
      loadAll();
    } catch (err) {
      console.log(err.response?.data);

      if (err.response?.status === 404) {
        setFormError('Không tìm thấy tài khoản.');
      } else if (err.response?.status === 400) {
        setFormError(err.response.data.message);
      } else {
        setFormError('Có lỗi xảy ra.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <div className="notif-header">
        <span className="overall-eyebrow">Quản trị</span>
        <h2 className="overall-title">Account manage</h2>
      </div>

      <form className="notif-form" onSubmit={handleSubmit}>
        <label className="notif-field">
          <span>Username</span>
          <input
            type="text"
            value={form.username}
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
            required
            disabled={isEditing}
          />
        </label>

        <label className="notif-field">
          <span>Full name</span>
          <input
            type="text"
            value={form.fullName}
            onChange={(e) =>
              setForm({ ...form, fullName: e.target.value })
            }
            disabled={isEditing}
            required
          />
        </label>

        <label className="notif-field">
          <span>Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            disabled={isEditing}
            required
          />
        </label>

        {!isEditing && (
          <label className="notif-field">
            <span>Password</span>
            <input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
            />
          </label>
        )}

        <label className="notif-field">
          <span>Phone</span>
          <input
            type="text"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
            disabled={isEditing}
            required
          />
        </label>

        <label className="notif-field">
          <span>Address</span>
          <input
            type="text"
            value={form.address}
            onChange={(e) =>
              setForm({ ...form, address: e.target.value })
            }
            disabled={isEditing}
          />
        </label>

        <label className="notif-field">
          <span>Role</span>
          <select
            value={form.role}
            onChange={(e) =>
              setForm({
                ...form,
                role: e.target.value,
              })
            }
            disabled={isEditing}
          >
            <option value="MEMBER">MEMBER</option>
            <option value="VIP">VIP</option>
            <option value="LIBRARIAN">LIBRARIAN</option>
            <option value="ADMIN">ADMIN</option>
          </select>
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
                : 'Tạo tài khoản'}
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
          Không tải được danh sách tài khoản.
        </p>
      )}

      {status === 'loading' && (
        <p className="notif-empty">Đang tải…</p>
      )}

      {status === 'ready' && accounts.length === 0 && (
        <p className="notif-empty">
          Chưa có tài khoản nào.
        </p>
      )}

      {status === 'ready' && accounts.length > 0 && (
        <ul className="notif-list">
          {accounts.map((u) => (
            <li key={u.username} className="notif-row">
              <div className="notif-row-main">
                <div className="notif-row-top">
                  <span className="notif-row-title">
                    {u.username}
                  </span>
                </div>

                <span className="notif-row-content">
                  {u.fullName}
                </span>

                <span className="notif-row-content">
                  {u.email}
                </span>

                <span className="notif-row-content">
                  {u.phone}
                </span>

                <span className="notif-row-content">
                  {u.address}
                </span>

                <span className="notif-row-meta">
                  Role: {u.role?.name} · Status: {u.userStatus}
                </span>
              </div>

              <div className="notif-row-actions">
                <button
                  type="button"
                  onClick={() => handleEdit(u)}
                >
                  Sửa
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}