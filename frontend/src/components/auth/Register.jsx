// src/components/auth/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        phone: '',
        address: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username || formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }
        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Valid email is required';
        }
        if (!formData.password || formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        if (!formData.fullName) {
            newErrors.fullName = 'Full name is required';
        }
        if (!formData.phone || !/^[0-9]{10,11}$/.test(formData.phone)) {
            newErrors.phone = 'Phone number must be 10-11 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: '',
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setSuccessMessage('');

        const registerData = {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            fullName: formData.fullName,
            phone: formData.phone,
            address: formData.address,
        };

        const result = await register(registerData);

        if (result.success) {
            setSuccessMessage('Registration successful! Please check your email for confirmation.');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } else {
            setErrors({ form: result.error });
        }
        setLoading(false);
    };

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow">
                        <div className="card-body">
                            <h3 className="text-center mb-4">Create Account</h3>

                            {successMessage && (
                                <div className="alert alert-success" role="alert">
                                    {successMessage}
                                </div>
                            )}

                            {errors.form && (
                                <div className="alert alert-danger" role="alert">
                                    {errors.form}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="username" className="form-label">
                                            Username*
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                            id="username"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            required
                                            placeholder="Choose a username"
                                        />
                                        {errors.username && (
                                            <div className="invalid-feedback">{errors.username}</div>
                                        )}
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="fullName" className="form-label">
                                            Full Name*
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                                            id="fullName"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your full name"
                                        />
                                        {errors.fullName && (
                                            <div className="invalid-feedback">{errors.fullName}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">
                                        Email Address*
                                    </label>
                                    <input
                                        type="email"
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your email"
                                    />
                                    {errors.email && (
                                        <div className="invalid-feedback">{errors.email}</div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="phone" className="form-label">
                                        Phone Number*
                                    </label>
                                    <input
                                        type="tel"
                                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter 10-11 digit phone number"
                                    />
                                    {errors.phone && (
                                        <div className="invalid-feedback">{errors.phone}</div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="address" className="form-label">
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Enter your address"
                                    />
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="password" className="form-label">
                                            Password*
                                        </label>
                                        <input
                                            type="password"
                                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            placeholder="Min 6 characters"
                                        />
                                        {errors.password && (
                                            <div className="invalid-feedback">{errors.password}</div>
                                        )}
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="confirmPassword" className="form-label">
                                            Confirm Password*
                                        </label>
                                        <input
                                            type="password"
                                            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                            placeholder="Confirm your password"
                                        />
                                        {errors.confirmPassword && (
                                            <div className="invalid-feedback">{errors.confirmPassword}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <Link to="/login" className="text-decoration-none">
                                        Already have an account? Login
                                    </Link>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Creating account...
                                        </>
                                    ) : (
                                        'Create Account'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;