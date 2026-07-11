import { useEffect, useState } from "react";
import api from "../../api";

const NOTIF_TYPES = ["GENERAL", "SYSTEM", "OVERDUE", "RESERVATION", "PAYMENT"];

const emptyForm = { title: "", message: "", type: "GENERAL", userId: "" };

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null); // null = dang tao moi
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  function loadNotifications() {
    setLoading(true);
    api
      .get("/admin/notifications")
      .then((res) => setNotifications(res.data))
      .catch(() => setError("Khong tai duoc danh sach thong bao"))
      .finally(() => setLoading(false));
  }

  useEffect(loadNotifications, []);

  function openCreateForm() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEditForm(n) {
    setEditingId(n.id);
    setForm({ title: n.title, message: n.message, type: n.type, userId: n.userId });
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      if (editingId) {
        await api.put(`/admin/notifications/${editingId}`, form);
      } else {
        await api.post("/admin/notifications", form);
      }
      setShowForm(false);
      loadNotifications();
    } catch (err) {
      setError("Khong luu duoc thong bao");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Xoa thong bao nay?")) return;
    try {
      await api.delete(`/admin/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      setError("Khong xoa duoc thong bao");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Thong bao</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gui va quan ly thong bao toi nguoi dung
          </p>
        </div>
        <button
          onClick={openCreateForm}
          className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          + Thong bao moi
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-6 flex gap-6">
        {/* Danh sach */}
        <div className="flex-1 rounded-lg border border-gray-200 bg-white shadow-sm">
          {loading && <p className="p-6 text-sm text-gray-500">Dang tai...</p>}

          {!loading && notifications.length === 0 && (
            <p className="p-6 text-sm text-gray-500">Chua co thong bao nao</p>
          )}

          {!loading &&
            notifications.map((n) => (
              <div
                key={n.id}
                className="flex items-start justify-between gap-4 border-b border-gray-100 p-4 last:border-b-0"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800">{n.title}</span>
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                      {n.type}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {n.message}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    {n.userId} ·{" "}
                    {n.createdAt
                      ? new Date(n.createdAt).toLocaleString("vi-VN")
                      : ""}
                  </p>
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => openEditForm(n)}
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    Sua
                  </button>
                  <button
                    onClick={() => handleDelete(n.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Xoa
                  </button>
                </div>
              </div>
            ))}
        </div>

        {/* Form tao / sua */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="w-80 shrink-0 rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
          >
            <h2 className="mb-4 font-semibold text-gray-800">
              {editingId ? "Sua thong bao" : "Thong bao moi"}
            </h2>

            <label className="mb-3 block">
              <span className="mb-1 block text-xs font-medium text-gray-500">
                Tieu de
              </span>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
            </label>

            <label className="mb-3 block">
              <span className="mb-1 block text-xs font-medium text-gray-500">
                Noi dung
              </span>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                rows={4}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
            </label>

            <label className="mb-3 block">
              <span className="mb-1 block text-xs font-medium text-gray-500">
                Loai
              </span>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              >
                {NOTIF_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>

            {!editingId && (
              <label className="mb-3 block">
                <span className="mb-1 block text-xs font-medium text-gray-500">
                  Nguoi nhan (username)
                </span>
                <input
                  type="text"
                  value={form.userId}
                  onChange={(e) => setForm({ ...form, userId: e.target.value })}
                  required
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                />
              </label>
            )}

            <div className="mt-4 flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {submitting ? "Dang luu..." : "Luu"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Huy
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
