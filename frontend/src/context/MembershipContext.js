// src/context/MembershipContext.js
import { createContext, useCallback, useContext, useState } from 'react';
import { membershipApi } from '../api/membershipApi';
import { paymentApi } from '../api/paymentApi';

const MembershipContext = createContext();

export const useMembership = () => {
    const context = useContext(MembershipContext);
    if (!context) {
        throw new Error('useMembership must be used within MembershipProvider');
    }
    return context;
};

export const MembershipProvider = ({ children }) => {
    const [membershipTypes, setMembershipTypes] = useState([]);
    const [currentMembership, setCurrentMembership] = useState(null);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Get all membership types
    const fetchMembershipTypes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await membershipApi.getAllTypes();
            setMembershipTypes(response.data);
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to load membership types';
            setError(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Get current user's membership
    const fetchCurrentMembership = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await membershipApi.getCurrent();
            setCurrentMembership(response.data);
            return response.data;
        } catch (err) {
            if (err.response?.status === 404) {
                setCurrentMembership(null);
                return null;
            }
            const errorMsg = err.response?.data?.message || 'Failed to load membership';
            setError(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Register new membership
    const registerMembership = async (membershipTypeId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await membershipApi.register({ membershipTypeId });
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to register membership';
            setError(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Renew membership
    const renewMembership = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await membershipApi.renew();
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to renew membership';
            setError(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Get payment history
    const fetchPayments = useCallback(async (page = 0, size = 10) => {
        setLoading(true);
        setError(null);
        try {
            const response = await paymentApi.getMyPayments(page, size);
            setPayments(response.data);
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to load payment history';
            setError(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Cancel payment
    const cancelPayment = async (paymentId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await paymentApi.cancelPayment(paymentId);
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to cancel payment';
            setError(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const value = {
        membershipTypes,
        currentMembership,
        payments,
        loading,
        error,
        fetchMembershipTypes,
        fetchCurrentMembership,
        registerMembership,
        renewMembership,
        fetchPayments,
        cancelPayment,
        setError,
    };

    return (
        <MembershipContext.Provider value={value}>
            {children}
        </MembershipContext.Provider>
    );
};