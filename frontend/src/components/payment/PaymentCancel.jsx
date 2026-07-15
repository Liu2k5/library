import { useNavigate } from 'react-router-dom';

const PaymentCancel = () => {
    const navigate = useNavigate();

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-sm text-center p-5">
                        <div className="mb-4">
                            <div className="display-1 text-warning">
                                <i className="bi bi-x-circle-fill"></i>
                            </div>
                        </div>
                        <h3 className="mb-3">Payment Cancelled</h3>
                        <p className="text-muted">
                            You have cancelled the payment process. No charges have been made.
                        </p>
                        <div className="d-flex gap-2 justify-content-center mt-3">
                            <button className="btn btn-outline-secondary" onClick={() => navigate('/membership')}>
                                Back to Membership
                            </button>
                            <button className="btn btn-primary" onClick={() => navigate(-1)}>
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentCancel;