import { useState } from "react";

import { getBorrowsByEmail, returnBooks, reportLostBook } from "../../api/borrowApi";

import "bootstrap/dist/css/bootstrap.min.css";

function ReturnBook() {
    const [email, setEmail] = useState("");
    const [borrows, setBorrows] = useState([]);
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    // { [borrowId]: Set<barcode> }
    const [selected, setSelected] = useState({});
    // { [borrowId]: ReturnResponse }
    const [returnResults, setReturnResults] = useState({});
    // { [borrowId]: FineResponse[] } — phiếu phạt mất sách vừa tạo
    const [lostResults, setLostResults] = useState({});
    // { borrowId, barcode, bookTitle } — sách đang được lập phiếu mất
    const [lostTarget, setLostTarget] = useState(null);
    const [lostAmount, setLostAmount] = useState("");
    const [lostReason, setLostReason] = useState("");

    const fmtDate = (d) => (d ? new Date(d).toLocaleDateString() : "-");

    const loadBorrows = async () => {
        if (!email.trim()) {
            setError("Please enter the member's email.");
            return;
        }
        setError("");
        setReturnResults({});
        setLostResults({});
        setSelected({});
        setLostTarget(null);
        try {
            setLoading(true);
            const res = await getBorrowsByEmail(email.trim());
            setBorrows(res.data || []);
            setSearched(true);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load borrow slips.");
            setBorrows([]);
        } finally {
            setLoading(false);
        }
    };

    const toggleBarcode = (borrowId, barcode) => {
        setSelected((prev) => {
            const current = new Set(prev[borrowId] || []);
            if (current.has(barcode)) current.delete(barcode);
            else current.add(barcode);
            return { ...prev, [borrowId]: current };
        });
    };

    const doReturn = async (borrowId, barcodes) => {
        setError("");
        try {
            const res = await returnBooks({ borrowId, barcodes });
            setReturnResults((prev) => ({ ...prev, [borrowId]: res.data }));
            await loadBorrows();
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.errorCode || "Failed to return books.");
        }
    };

    const returnSelected = (borrowId) => {
        const set = selected[borrowId];
        const barcodes = set ? Array.from(set) : [];
        if (barcodes.length === 0) {
            setError("Select at least one book to return, or use 'Return all remaining'.");
            return;
        }
        doReturn(borrowId, barcodes);
    };

    // Bỏ trống barcodes = backend trả toàn bộ bản sao chưa trả
    const returnAll = (borrowId) => doReturn(borrowId, []);

    const openLostForm = (borrowId, barcode, bookTitle) => {
        setError("");
        setLostTarget({ borrowId, barcode, bookTitle });
        setLostAmount("");
        setLostReason("");
    };

    const cancelLostForm = () => {
        setLostTarget(null);
        setLostAmount("");
        setLostReason("");
    };

    const submitLost = async () => {
        if (!lostTarget) return;
        const { borrowId, barcode } = lostTarget;
        const payload = { borrowId, barcode };
        if (lostAmount !== "") payload.amount = Number(lostAmount);
        if (lostReason.trim() !== "") payload.reason = lostReason.trim();
        setError("");
        try {
            const res = await reportLostBook(payload);
            setLostResults((prev) => ({
                ...prev,
                [borrowId]: [...(prev[borrowId] || []), res.data],
            }));
            cancelLostForm();
            await loadBorrows();
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.errorCode || "Failed to create fine for lost book.");
        }
    };

    const renderItemStatus = (item, lostBarcodes) => {
        if (lostBarcodes.has(item.barcode)) {
            return <span className="badge bg-danger">Lost</span>;
        }
        if (item.returnDate) {
            return <span className="badge bg-success">Returned {fmtDate(item.returnDate)}</span>;
        }
        return <span className="badge bg-warning text-dark">Borrowing</span>;
    };

    return (
        <div className="container mt-4" style={{ maxWidth: 900 }}>
            <h3 className="mb-3">
                <i className="bi bi-journal-arrow-up me-2"></i>
                Return Books
            </h3>

            <div className="input-group mb-3" style={{ maxWidth: 520 }}>
                <input
                    type="email"
                    className="form-control"
                    placeholder="Member email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && loadBorrows()}
                />
                <button className="btn btn-primary" onClick={loadBorrows} disabled={loading}>
                    <i className="bi bi-search me-1"></i>
                    {loading ? "Searching..." : "Search"}
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {searched && borrows.length === 0 && !loading && (
                <div className="alert alert-info">No borrow slips found for this member.</div>
            )}

            {borrows.map((borrow) => {
                const result = returnResults[borrow.id];
                const lostFines = lostResults[borrow.id];
                const lostBarcodes = new Set((lostFines || []).map((f) => f.barcode));
                const remainingItems = (borrow.items || []).filter((it) => !it.returnDate);
                const overdue = !borrow.returned && borrow.dueDate && new Date(borrow.dueDate) < new Date();

                return (
                    <div className="card mb-3 shadow-sm" key={borrow.id}>
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <span>
                                <strong>Slip #{borrow.id}</strong> — {borrow.fullName} ({borrow.username})
                            </span>
                            <span>
                                {borrow.returned ? (
                                    <span className="badge bg-secondary">Fully returned</span>
                                ) : overdue ? (
                                    <span className="badge bg-danger">Overdue</span>
                                ) : (
                                    <span className="badge bg-warning text-dark">Active</span>
                                )}
                            </span>
                        </div>
                        <div className="card-body">
                            <p className="mb-2 text-muted">
                                Borrowed: {fmtDate(borrow.borrowDate)} &nbsp;|&nbsp; Due: {fmtDate(borrow.dueDate)}
                            </p>
                            <table className="table table-sm table-bordered align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th style={{ width: 40 }}></th>
                                        <th>Barcode</th>
                                        <th>Book title</th>
                                        <th>Status</th>
                                        <th style={{ width: 90 }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(borrow.items || []).map((item) => {
                                        const isOpen = !item.returnDate;
                                        const checked = selected[borrow.id]?.has(item.barcode) || false;
                                        return (
                                            <tr key={item.detailId}>
                                                <td className="text-center">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        checked={checked}
                                                        disabled={!isOpen}
                                                        onChange={() => toggleBarcode(borrow.id, item.barcode)}
                                                    />
                                                </td>
                                                <td>{item.barcode}</td>
                                                <td>{item.bookTitle}</td>
                                                <td>{renderItemStatus(item, lostBarcodes)}</td>
                                                <td className="text-center">
                                                    {isOpen && (
                                                        <button
                                                            className="btn btn-outline-danger btn-sm"
                                                            onClick={() => openLostForm(borrow.id, item.barcode, item.bookTitle)}
                                                            title="Report as lost and create a fine"
                                                        >
                                                            Lost
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            {!borrow.returned && remainingItems.length > 0 && (
                                <div className="d-flex gap-2">
                                    <button className="btn btn-outline-success btn-sm" onClick={() => returnSelected(borrow.id)}>
                                        Return selected
                                    </button>
                                    <button className="btn btn-success btn-sm" onClick={() => returnAll(borrow.id)}>
                                        Return all remaining
                                    </button>
                                </div>
                            )}

                            {/* Form lập phiếu phạt mất sách */}
                            {lostTarget && lostTarget.borrowId === borrow.id && (
                                <div className="card border-danger mt-3">
                                    <div className="card-body">
                                        <h6 className="text-danger mb-3">
                                            <i className="bi bi-exclamation-triangle me-2"></i>
                                            Report lost: {lostTarget.barcode} — {lostTarget.bookTitle}
                                        </h6>
                                        <div className="row g-2">
                                            <div className="col-12 col-md-4">
                                                <label className="form-label mb-1">Fine amount (đ)</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    className="form-control"
                                                    placeholder="Empty = book price"
                                                    value={lostAmount}
                                                    onChange={(e) => setLostAmount(e.target.value)}
                                                />
                                            </div>
                                            <div className="col-12 col-md-8">
                                                <label className="form-label mb-1">Reason</label>
                                                <input
                                                    className="form-control"
                                                    placeholder="Empty = &quot;Mất sách: <title>&quot;"
                                                    value={lostReason}
                                                    onChange={(e) => setLostReason(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-3 d-flex gap-2">
                                            <button className="btn btn-danger btn-sm" onClick={submitLost}>
                                                Create fine
                                            </button>
                                            <button className="btn btn-secondary btn-sm" onClick={cancelLostForm}>
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {result && (
                                <div className="mt-3">
                                    <div className="alert alert-success py-2 mb-2">
                                        {result.fullyReturned
                                            ? "All books in this slip have been returned."
                                            : `${result.returnedItems?.length || 0} book(s) returned.`}
                                    </div>
                                    {result.fines && result.fines.length > 0 && (
                                        <div className="alert alert-warning py-2 mb-0">
                                            <strong>Late fees:</strong>
                                            <ul className="mb-0">
                                                {result.fines.map((f) => (
                                                    <li key={f.id}>
                                                        {f.barcode}: {Number(f.amount).toLocaleString()} đ — {f.reason}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}

                            {lostFines && lostFines.length > 0 && (
                                <div className="alert alert-danger py-2 mt-3 mb-0">
                                    <strong>Fines created for lost book(s):</strong>
                                    <ul className="mb-1">
                                        {lostFines.map((f) => (
                                            <li key={f.id}>
                                                {f.barcode}: {Number(f.amount).toLocaleString()} đ — {f.reason}
                                                {" "}<span className="badge bg-secondary">{f.status}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <small className="text-muted">
                                        The member can pay this fine from their account (Payment / PayOS).
                                    </small>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default ReturnBook;
