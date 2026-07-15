import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMembership } from '../../context/MembershipContext';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { fetchCurrentMembership } = useMembership();
    const payment = location.state?.payment;

    useEffect(() => {
        // Refresh membership data
        fetchCurrentMembership();
    }, [fetchCurrentMembership]);

    const handleContinue = () => {
        navigate('/membership');
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-sm text-center p-5">
                        <div className="mb-4">
                            <div className="display-1 text-success">
                                <i className="bi bi-check-circle-fill"></i>
                            </div>
                        </div>
                        <h3 className="mb-3">Payment Successful! 🎉</h3>
                        <p className="text-muted">
                            Your payment has been processed successfully.
                            {payment && (
                                <>
                                    <br />
                                    <small>
                                        Transaction ID: <strong>{payment.id}</strong>
                                        <br />
                                        Amount: <strong>{payment.amount?.toLocaleString()} VND</strong>
                                    </small>
                                </>
                            )}
                        </p>
                        <p className="text-muted small">
                            Your membership has been activated. You can now start borrowing books.
                        </p>
                        <button className="btn btn-primary mt-3" onClick={handleContinue}>
                            Go to Membership
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;