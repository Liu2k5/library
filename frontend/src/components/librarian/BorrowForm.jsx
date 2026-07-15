import { useState } from "react";

import { createBorrow } from "../../api/borrowApi";

import "bootstrap/dist/css/bootstrap.min.css";

function BorrowForm() {
    const [email, setEmail] = useState("");
    const [durationDay, setDurationDay] = useState("");
    const [barcodes, setBarcodes] = useState([""]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState(null);

    const handleBarcodeChange = (index, value) => {
        const next = [...barcodes];
        next[index] = value;
        setBarcodes(next);
    };

    const addBarcode = () => setBarcodes([...barcodes, ""]);

    const removeBarcode = (index) => {
        if (barcodes.length === 1) return;
        setBarcodes(barcodes.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setResult(null);

        const cleanBarcodes = barcodes.map(b => b.trim()).filter(b => b !== "");
        if (!email.trim()) {
            setError("Please enter the member's email.");
            return;
        }
        if (cleanBarcodes.length === 0) {
            setError("Please enter at least one barcode.");
            return;
        }

        const payload = {
            email: email.trim(),
            barcodes: cleanBarcodes,
            durationDay: durationDay === "" ? null : Number(durationDay),
        };

        try {
            setLoading(true);
            const res = await createBorrow(payload);
            setResult(res.data);
            // reset form (giữ lại kết quả để in/xem)
            setEmail("");
            setDurationDay("");
            setBarcodes([""]);
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.errorCode || "Failed to create borrow record.");
        } finally {
            setLoading(false);
        }
    };

    const fmtDate = (d) => (d ? new Date(d).toLocaleDateString() : "-");

    return (
        <div className="container mt-4" style={{ maxWidth: 760 }}>
            <h3 className="mb-3">
                <i className="bi bi-journal-plus me-2"></i>
                Create Borrow Record
            </h3>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
                <div className="mb-3">
                    <label className="form-label">Member email</label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="member@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Borrow duration (days)</label>
                    <input
                        type="number"
                        min="1"
                        className="form-control"
                        placeholder="Leave empty to use the membership default"
                        value={durationDay}
                        onChange={(e) => setDurationDay(e.target.value)}
                    />
                    <div className="form-text">Optional — falls back to the member's plan if empty.</div>
                </div>

                <div className="mb-3">
                    <label className="form-label">Book copy barcodes</label>
                    {barcodes.map((code, index) => (
                        <div className="input-group mb-2" key={index}>
                            <span className="input-group-text">{index + 1}</span>
                            <input
                                className="form-control"
                                placeholder="Scan or type barcode"
                                value={code}
                                onChange={(e) => handleBarcodeChange(index, e.target.value)}
                            />
                            <button
                                type="button"
                                className="btn btn-outline-danger"
                                onClick={() => removeBarcode(index)}
                                disabled={barcodes.length === 1}
                                title="Remove"
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                    ))}
                    <button type="button" className="btn btn-outline-primary btn-sm" onClick={addBarcode}>
                        <i className="bi bi-plus-lg me-1"></i>
                        Add barcode
                    </button>
                </div>

                <button className="btn btn-success" disabled={loading}>
                    {loading ? "Creating..." : "Create Borrow Record"}
                </button>
            </form>

            {result && (
                <div className="card mt-4 border-success shadow-sm">
                    <div className="card-header bg-success text-white">
                        <i className="bi bi-check-circle me-2"></i>
                        Borrow record #{result.id} created
                    </div>
                    <div className="card-body">
                        <p className="mb-1"><strong>Member:</strong> {result.fullName} ({result.username})</p>
                        <p className="mb-1"><strong>Borrow date:</strong> {fmtDate(result.borrowDate)}</p>
                        <p className="mb-3"><strong>Due date:</strong> {fmtDate(result.dueDate)}</p>
                        <table className="table table-sm table-bordered mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Barcode</th>
                                    <th>Book title</th>
                                </tr>
                            </thead>
                            <tbody>
                                {result.items?.map((item) => (
                                    <tr key={item.detailId}>
                                        <td>{item.barcode}</td>
                                        <td>{item.bookTitle}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BorrowForm;
