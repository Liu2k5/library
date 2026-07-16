import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { QRCodeSVG } from "qrcode.react";

import { getFines, markFinePaid, createFinePayment } from "../../api/fineApi";

import "bootstrap/dist/css/bootstrap.min.css";

function FineList() {
    const [fines, setFines] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [status, setStatus] = useState("");
    const [keyword, setKeyword] = useState("");

    // Modal đánh dấu đã thanh toán (tiền mặt / xác nhận)
    const [payTarget, setPayTarget] = useState(null); // fine object
    const [copyStatusChoice, setCopyStatusChoice] = useState("");
    const [saving, setSaving] = useState(false);

    // Modal QR PayOS
    const [qrTarget, setQrTarget] = useState(null); // { fine, paymentUrl, amount }
    const [qrLoading, setQrLoading] = useState(false);

    useEffect(() => {
        loadFines();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status]);

    const loadFines = async () => {
        setError("");
        try {
            setLoading(true);
            const res = await getFines(status);
            setFines(res.data || []);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load fines.");
            setFines([]);
        } finally {
            setLoading(false);
        }
    };

    const fmtDate = (d) => (d ? new Date(d).toLocaleDateString() : "-");

    const statusBadge = (s) => {
        if (s === "PAID") return <span className="badge bg-success">Paid</span>;
        if (s === "UNPAID") return <span className="badge bg-danger">Unpaid</span>;
        if (s === "WAIVED") return <span className="badge bg-secondary">Waived</span>;
        return <span className="badge bg-light text-dark">{s || "-"}</span>;
    };

    // ----- Đánh dấu đã thanh toán -----
    const openPay = (fine) => {
        setError("");
        setCopyStatusChoice("");
        setPayTarget(fine);
    };

    const confirmPay = async () => {
        if (!payTarget) return;
        setSaving(true);
        setError("");
        try {
            await markFinePaid(payTarget.id, { copyStatus: copyStatusChoice || null });
            setPayTarget(null);
            await loadFines();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to mark fine as paid.");
        } finally {
            setSaving(false);
        }
    };

    // ----- QR PayOS -----
    const openQr = async (fine) => {
        setError("");
        setQrLoading(true);
        try {
            const res = await createFinePayment(fine.id);
            setQrTarget({ fine, paymentUrl: res.data.paymentUrl, amount: res.data.amount });
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.errorCode || "Failed to create PayOS payment.");
        } finally {
            setQrLoading(false);
        }
    };

    const markQrPaid = async () => {
        if (!qrTarget) return;
        setSaving(true);
        try {
            await markFinePaid(qrTarget.fine.id, {});
            setQrTarget(null);
            await loadFines();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to confirm payment.");
        } finally {
            setSaving(false);
        }
    };

    // Lọc theo từ khóa phía client
    const filtered = fines.filter((f) => {
        if (!keyword.trim()) return true;
        const k = keyword.trim().toLowerCase();
        return [f.memberFullName, f.memberUsername, f.memberEmail, f.barcode, f.bookTitle, f.reason]
            .some((v) => v && v.toLowerCase().includes(k));
    });

    const totalUnpaid = fines
        .filter((f) => f.status === "UNPAID")
        .reduce((sum, f) => sum + (Number(f.amount) || 0), 0);

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="mb-0">
                    <i className="bi bi-cash-coin me-2"></i>
                    Fines
                </h3>
                <span className="text-muted">
                    Outstanding (unpaid): <strong className="text-danger">{totalUnpaid.toLocaleString()} đ</strong>
                </span>
            </div>

            <div className="row g-2 mb-3">
                <div className="col-12 col-md-4">
                    <input
                        className="form-control"
                        placeholder="Search member, book, barcode..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>
                <div className="col-8 col-md-3">
                    <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="">All statuses</option>
                        <option value="UNPAID">Unpaid</option>
                        <option value="PAID">Paid</option>
                        <option value="WAIVED">Waived</option>
                    </select>
                </div>
                <div className="col-4 col-md-2">
                    <button className="btn btn-outline-secondary w-100" onClick={loadFines} disabled={loading}>
                        <i className="bi bi-arrow-clockwise me-1"></i>Refresh
                    </button>
                </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : filtered.length === 0 ? (
                <div className="alert alert-info">No fines found.</div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Member</th>
                                <th>Book</th>
                                <th>Barcode</th>
                                <th>Amount</th>
                                <th>Reason</th>
                                <th>Issued</th>
                                <th>Status</th>
                                <th style={{ width: 160 }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((f) => (
                                <tr key={f.id}>
                                    <td>{f.id}</td>
                                    <td>
                                        {f.memberFullName || f.memberUsername || "-"}
                                        {f.memberEmail && (
                                            <div className="small text-muted">{f.memberEmail}</div>
                                        )}
                                    </td>
                                    <td>{f.bookTitle || "-"}</td>
                                    <td>{f.barcode || "-"}</td>
                                    <td>{Number(f.amount).toLocaleString()} đ</td>
                                    <td>{f.reason}</td>
                                    <td>{fmtDate(f.issuedDate)}</td>
                                    <td>{statusBadge(f.status)}</td>
                                    <td>
                                        {f.status === "UNPAID" ? (
                                            <div className="d-flex gap-1">
                                                <button
                                                    className="btn btn-success btn-sm"
                                                    onClick={() => openPay(f)}
                                                    title="Cash / mark as paid"
                                                >
                                                    <i className="bi bi-cash me-1"></i>Paid
                                                </button>
                                                <button
                                                    className="btn btn-outline-primary btn-sm"
                                                    onClick={() => openQr(f)}
                                                    disabled={qrLoading}
                                                    title="Generate PayOS QR"
                                                >
                                                    <i className="bi bi-qr-code me-1"></i>QR
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-muted small">—</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal: Mark as paid */}
            <Modal show={!!payTarget} onHide={() => setPayTarget(null)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Mark fine as paid</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {payTarget && (
                        <>
                            <p className="mb-2">
                                <strong>{payTarget.memberFullName || payTarget.memberUsername}</strong> —{" "}
                                {Number(payTarget.amount).toLocaleString()} đ
                                <br />
                                <span className="text-muted small">{payTarget.reason}</span>
                            </p>
                            <label className="form-label">Book copy status after payment</label>
                            <select
                                className="form-select"
                                value={copyStatusChoice}
                                onChange={(e) => setCopyStatusChoice(e.target.value)}
                            >
                                <option value="">Keep unchanged</option>
                                <option value="AVAILABLE">Set AVAILABLE</option>
                                <option value="UNAVAILABLE">Set UNAVAILABLE</option>
                            </select>
                            <div className="form-text">
                                For a lost book, choose AVAILABLE only if it was replaced/returned.
                            </div>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setPayTarget(null)} disabled={saving}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={confirmPay} disabled={saving}>
                        {saving ? "Saving..." : "Confirm paid"}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal: PayOS QR */}
            <Modal show={!!qrTarget} onHide={() => setQrTarget(null)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Scan to pay (PayOS)</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    {qrTarget && (
                        <>
                            <p className="mb-2">
                                {qrTarget.fine.memberFullName || qrTarget.fine.memberUsername} —{" "}
                                <strong>{Number(qrTarget.amount).toLocaleString()} đ</strong>
                            </p>
                            <div className="d-flex justify-content-center my-3">
                                <QRCodeSVG value={qrTarget.paymentUrl} size={220} includeMargin />
                            </div>
                            <p className="small text-muted mb-1">
                                Ask the customer to scan this QR to open the PayOS payment page.
                            </p>
                            <a href={qrTarget.paymentUrl} target="_blank" rel="noreferrer" className="small">
                                Open payment page
                            </a>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setQrTarget(null)}>
                        Close
                    </Button>
                    <Button variant="success" onClick={markQrPaid} disabled={saving}>
                        {saving ? "Saving..." : "Customer has paid — mark Paid"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default FineList;
