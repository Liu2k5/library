// src/components/payment/BillModal.jsx
import { useEffect, useState } from 'react';
import { paymentApi } from '../../api/paymentApi';
import './BillModal.css';

const BillModal = ({ paymentId, onClose }) => {
    const [bill, setBill] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBill = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await paymentApi.getBill(paymentId);
                setBill(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load bill');
            } finally {
                setLoading(false);
            }
        };

        fetchBill();
    }, [paymentId]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = (status) => {
        const badges = {
            PENDING: 'warning',
            COMPLETED: 'success',
            FAILED: 'danger',
        };
        return (
            <span className={`badge bg-${badges[status] || 'secondary'}`}>
                {status}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="bill-modal-overlay" onClick={onClose}>
                <div className="bill-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="bill-loading">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bill-modal-overlay" onClick={onClose}>
                <div className="bill-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="bill-error">
                        <i className="bi bi-exclamation-triangle text-danger display-4"></i>
                        <p className="mt-3">{error}</p>
                        <button className="btn btn-primary" onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
        );
    }

    if (!bill) {
        return (
            <div className="bill-modal-overlay" onClick={onClose}>
                <div className="bill-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="bill-empty">
                        <i className="bi bi-receipt display-4 text-muted"></i>
                        <p className="mt-3">No bill found for this payment</p>
                        <button className="btn btn-primary" onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bill-modal-overlay" onClick={onClose}>
            <div className="bill-modal" onClick={(e) => e.stopPropagation()}>
                <div className="bill-modal-header">
                    <h4>
                        <i className="bi bi-receipt me-2"></i>
                        Bill #{bill.id}
                    </h4>
                    <button className="btn-close" onClick={onClose}></button>
                </div>
                <div className="bill-modal-body">
                    <div className="bill-info">
                        <div className="bill-row">
                            <span className="bill-label">Payment ID:</span>
                            <span className="bill-value">#{bill.paymentId}</span>
                        </div>
                        <div className="bill-row">
                            <span className="bill-label">Gateway:</span>
                            <span className="bill-value">{bill.gatewayName}</span>
                        </div>
                        <div className="bill-row">
                            <span className="bill-label">Transaction Code:</span>
                            <span className="bill-value">{bill.transactionCode}</span>
                        </div>
                        <div className="bill-row">
                            <span className="bill-label">Status:</span>
                            <span className="bill-value">{getStatusBadge(bill.status)}</span>
                        </div>
                        <div className="bill-row">
                            <span className="bill-label">Created At:</span>
                            <span className="bill-value">{formatDate(bill.createdAt)}</span>
                        </div>
                    </div>
                    <hr />
                    <div className="bill-footer">
                        <button className="btn btn-primary" onClick={() => window.print()}>
                            <i className="bi bi-printer me-1"></i>
                            Print
                        </button>
                        <button className="btn btn-outline-secondary" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillModal;