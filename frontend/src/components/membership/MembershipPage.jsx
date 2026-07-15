// src/components/membership/MembershipPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useMembership } from '../../context/MembershipContext';
import './MembershipPage.css';

const MembershipPage = () => {
    const { isAuthenticated } = useAuth();
    const {
        membershipTypes,
        currentMembership,
        loading,
        error,
        fetchMembershipTypes,
        fetchCurrentMembership,
        registerMembership,
        renewMembership,
    } = useMembership();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [actionError, setActionError] = useState(null);

    useEffect(() => {
        fetchMembershipTypes();
        if (isAuthenticated) {
            fetchCurrentMembership();
        }
    }, [isAuthenticated, fetchMembershipTypes, fetchCurrentMembership]);

    const handleRegister = async (typeId) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        setIsProcessing(true);
        setActionError(null);
        try {
            const payment = await registerMembership(typeId);
            if (payment.paymentUrl) {
                window.location.href = payment.paymentUrl;
            } else {
                navigate('/payment/success', { state: { payment } });
            }
        } catch (err) {
            setActionError(err.response?.data?.message || 'Registration failed');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRenew = async () => {
        setIsProcessing(true);
        setActionError(null);
        try {
            const payment = await renewMembership();
            if (payment.paymentUrl) {
                window.location.href = payment.paymentUrl;
            } else {
                navigate('/payment/success', { state: { payment } });
            }
        } catch (err) {
            setActionError(err.response?.data?.message || 'Renewal failed');
        } finally {
            setIsProcessing(false);
        }
    };

    const getStatusBadge = (membership) => {
        if (!membership) return null;
        if (membership.isExpired) {
            return <span className="badge status-expired">Expired</span>;
        }
        if (membership.canRenew) {
            return <span className="badge status-renew">Renew Now</span>;
        }
        return <span className="badge status-active">Active</span>;
    };

    const getDaysRemaining = (membership) => {
        if (!membership || !membership.daysRemaining) return null;
        const days = membership.daysRemaining;
        if (days < 0) return 'Expired';
        return `${days} day${days > 1 ? 's' : ''} remaining`;
    };

    if (loading && membershipTypes.length === 0) {
        return (
            <div className="membership-loading">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="membership-page">
            <h2 className="membership-title">
                <i className="bi bi-ticket-perforated me-2"></i>
                Membership Plans
            </h2>

            {/* Current Membership Section - Only visible when logged in */}
            {isAuthenticated && currentMembership && (
                <div className="current-membership-card mb-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col-md-7">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="membership-icon">
                                            <i className="bi bi-person-check"></i>
                                        </div>
                                        <div>
                                            <h5 className="mb-1">Your Current Membership</h5>
                                            <h6 className="mb-2 text-primary">{currentMembership.typeName}</h6>
                                            <div className="membership-details">
                                                <span className="me-3">
                                                    <i className="bi bi-calendar me-1"></i>
                                                    Started: {new Date(currentMembership.startDate).toLocaleDateString()}
                                                </span>
                                                <span>
                                                    <i className="bi bi-calendar-check me-1"></i>
                                                    Expires: {new Date(currentMembership.endDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-5 text-md-end">
                                    <div className="d-flex flex-wrap align-items-center justify-content-md-end gap-2">
                                        {getStatusBadge(currentMembership)}
                                        <span className="text-muted small">
                                            {getDaysRemaining(currentMembership)}
                                        </span>
                                        {currentMembership.canRenew && !currentMembership.isExpired && (
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={handleRenew}
                                                disabled={isProcessing}
                                            >
                                                {isProcessing ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-1" />
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="bi bi-arrow-repeat me-1"></i>
                                                        Renew
                                                    </>
                                                )}
                                            </button>
                                        )}
                                        {currentMembership.isExpired && (
                                            <button
                                                className="btn btn-warning btn-sm"
                                                onClick={handleRenew}
                                                disabled={isProcessing}
                                            >
                                                {isProcessing ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-1" />
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="bi bi-plus-circle me-1"></i>
                                                        Reactivate
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {currentMembership.borrowLimit && (
                                <div className="mt-2 text-muted small">
                                    <i className="bi bi-book me-1"></i>
                                    Borrow Limit: {currentMembership.borrowLimit} books
                                    {currentMembership.borrowDurationDay && (
                                        <> • {currentMembership.borrowDurationDay} days borrowing period</>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Error Messages */}
            {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => fetchMembershipTypes()}
                    />
                </div>
            )}

            {actionError && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {actionError}
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setActionError(null)}
                    />
                </div>
            )}

            {/* Membership Types Grid */}
            <div className="membership-grid">
                {membershipTypes.map((type) => (
                    <div className="membership-card" key={type.id}>
                        <div className="card h-100 shadow-sm hover-shadow">
                            <div className="card-body text-center">
                                <div className="membership-type-icon">
                                    <i className="bi bi-award"></i>
                                </div>
                                <h5 className="card-title mt-3">{type.name}</h5>
                                <div className="membership-price">
                                    <span className="price-amount">
                                        {type.price === 0 ? 'FREE' : `${type.price.toLocaleString()} VND`}
                                    </span>
                                </div>
                                <hr />
                                <ul className="membership-features list-unstyled text-start">
                                    <li>
                                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                                        Borrow up to <strong>{type.borrowLimit}</strong> books
                                    </li>
                                    <li>
                                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                                        {type.borrowDurationDay} days borrowing period
                                    </li>
                                    {type.description && (
                                        <li>
                                            <i className="bi bi-info-circle me-2"></i>
                                            {type.description}
                                        </li>
                                    )}
                                </ul>
                                <button
                                    className="btn btn-primary w-100 mt-3"
                                    onClick={() => handleRegister(type.id)}
                                    disabled={
                                        isProcessing ||
                                        (currentMembership &&
                                            currentMembership.typeName === type.name &&
                                            !currentMembership.isExpired &&
                                            !currentMembership.canRenew)
                                    }
                                >
                                    {isProcessing ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-1" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            {currentMembership &&
                                                currentMembership.typeName === type.name &&
                                                !currentMembership.isExpired &&
                                                !currentMembership.canRenew
                                                ? 'Current Plan'
                                                : currentMembership &&
                                                    currentMembership.typeName === type.name &&
                                                    currentMembership.canRenew
                                                    ? 'Renew Now'
                                                    : currentMembership && currentMembership.isExpired
                                                        ? 'Reactivate'
                                                        : 'Choose Plan'}
                                        </>
                                    )}
                                </button>
                                {currentMembership &&
                                    currentMembership.typeName === type.name &&
                                    !currentMembership.isExpired &&
                                    !currentMembership.canRenew && (
                                        <small className="text-muted d-block mt-2">
                                            <i className="bi bi-check-circle me-1"></i>
                                            Active Plan
                                        </small>
                                    )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty state when no membership types */}
            {!loading && membershipTypes.length === 0 && (
                <div className="text-center py-5">
                    <i className="bi bi-ticket display-1 text-muted"></i>
                    <h4 className="mt-3">No Membership Plans Available</h4>
                    <p className="text-muted">Please check back later for membership options.</p>
                </div>
            )}
        </div>
    );
};

export default MembershipPage;