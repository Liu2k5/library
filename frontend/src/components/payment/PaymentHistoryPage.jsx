// src/components/payment/PaymentHistoryPage.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMembership } from '../../context/MembershipContext';
import BillModal from '../payment/BillModal';
import './PaymentHistoryPage.css';

const PaymentHistory = () => {
    const { payments, loading, error, fetchPayments, cancelPayment } = useMembership();
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [cancelling, setCancelling] = useState(null);
    const [selectedPaymentId, setSelectedPaymentId] = useState(null);
    const [showBillModal, setShowBillModal] = useState(false);

    useEffect(() => {
        fetchPayments(page, size).then((data) => {
            if (data) {
                setTotalPages(data.totalPages || 0);
            }
        });
    }, [page, size, fetchPayments]);

    const handleCancel = async (paymentId) => {
        if (!window.confirm('Are you sure you want to cancel this payment?')) return;

        setCancelling(paymentId);
        try {
            await cancelPayment(paymentId);
            await fetchPayments(page, size);
        } catch (err) {
            console.error('Failed to cancel payment:', err);
        } finally {
            setCancelling(null);
        }
    };

    const handleViewBill = (paymentId) => {
        setSelectedPaymentId(paymentId);
        setShowBillModal(true);
    };

    const closeBillModal = () => {
        setShowBillModal(false);
        setSelectedPaymentId(null);
    };

    const getStatusBadge = (status) => {
        const badges = {
            PENDING: 'warning',
            COMPLETED: 'success',
            FAILED: 'danger',
            REFUNDED: 'secondary',
        };
        return (
            <span className={`badge bg-${badges[status] || 'secondary'}`}>
                {status}
            </span>
        );
    };

    const getTypeBadge = (type) => {
        const badges = {
            MEMBERSHIP: 'primary',
            FINE: 'danger',
        };
        return (
            <span className={`badge bg-${badges[type] || 'secondary'}`}>
                {type}
            </span>
        );
    };

    const getPaymentStatusText = (status) => {
        const texts = {
            PENDING: 'Awaiting payment',
            COMPLETED: 'Paid successfully',
            FAILED: 'Payment failed',
            REFUNDED: 'Refunded',
        };
        return texts[status] || status;
    };

    if (loading && page === 0) {
        return (
            <div className="payment-loading">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="payment-history-page">
            <h2 className="payment-title">
                <i className="bi bi-credit-card me-2"></i>
                Payment History
            </h2>

            {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => fetchPayments(page, size)}
                    />
                </div>
            )}

            {payments && payments.content && payments.content.length > 0 ? (
                <>
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead className="table-light">
                                <tr>
                                    <th>Transaction ID</th>
                                    <th>Type</th>
                                    <th>Amount</th>
                                    <th>Method</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.content.map((payment) => (
                                    <tr key={payment.id}>
                                        <td>
                                            <strong>#{payment.id}</strong>
                                        </td>
                                        <td>{getTypeBadge(payment.type)}</td>
                                        <td>
                                            <strong>{payment.amount.toLocaleString()} VND</strong>
                                        </td>
                                        <td>{payment.method || 'N/A'}</td>
                                        <td>
                                            {payment.date ? new Date(payment.date).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td>
                                            {getStatusBadge(payment.status)}
                                            <small className="d-block text-muted">
                                                {getPaymentStatusText(payment.status)}
                                            </small>
                                        </td>
                                        <td>
                                            {payment.status === 'PENDING' && (
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleCancel(payment.id)}
                                                    disabled={cancelling === payment.id}
                                                >
                                                    {cancelling === payment.id ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-1" />
                                                            Cancelling...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="bi bi-x-circle me-1"></i>
                                                            Cancel
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                            {payment.paymentUrl && payment.status === 'PENDING' && (
                                                <button
                                                    className="btn btn-primary btn-sm ms-1"
                                                    onClick={() => window.open(payment.paymentUrl, '_blank')}
                                                >
                                                    <i className="bi bi-box-arrow-up-right me-1"></i>
                                                    Pay
                                                </button>
                                            )}
                                            {payment.status === 'COMPLETED' && (
                                                <button
                                                    className="btn btn-outline-secondary btn-sm"
                                                    onClick={() => handleViewBill(payment.id)}
                                                >
                                                    <i className="bi bi-receipt me-1"></i>
                                                    Bill
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {payments.totalPages > 1 && (
                        <nav>
                            <ul className="pagination justify-content-center">
                                <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => setPage(page - 1)}>
                                        Previous
                                    </button>
                                </li>
                                {[...Array(payments.totalPages).keys()].map((num) => (
                                    <li key={num} className={`page-item ${page === num ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => setPage(num)}>
                                            {num + 1}
                                        </button>
                                    </li>
                                ))}
                                <li className={`page-item ${page === payments.totalPages - 1 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => setPage(page + 1)}>
                                        Next
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    )}
                </>
            ) : (
                <div className="text-center py-5">
                    <i className="bi bi-credit-card display-1 text-muted"></i>
                    <h4 className="mt-3">No Payment History</h4>
                    <p className="text-muted">
                        You haven't made any payments yet.
                        <br />
                        <Link to="/membership" className="btn btn-primary mt-3">
                            Browse Membership Plans
                        </Link>
                    </p>
                </div>
            )}

            {/* Bill Modal */}
            {showBillModal && (
                <BillModal
                    paymentId={selectedPaymentId}
                    onClose={closeBillModal}
                />
            )}
        </div>
    );
};

export default PaymentHistory;