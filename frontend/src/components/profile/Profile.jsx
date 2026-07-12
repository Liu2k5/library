// src/components/profile/Profile.js
import { useEffect, useState } from 'react';
import { authApi } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
    const { updateProfile } = useAuth();
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        address: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await authApi.getProfile();
            setProfile(response.data);
            setFormData({
                fullName: response.data.fullName || '',
                phone: response.data.phone || '',
                address: response.data.address || '',
            });
        } catch (error) {
            setError('Failed to load profile');
        }
    };

    const validateForm = () => {
        const newErrors = {};

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
        setMessage('');
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setMessage('');
        setError('');

        const result = await updateProfile(formData);
        if (result.success) {
            setProfile(result.data);
            setMessage('Profile updated successfully!');
            setIsEditing(false);
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    if (!profile) {
        return (
            <div className="container mt-5">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-8 mx-auto">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                            <h4 className="mb-0">User Profile</h4>
                            {!isEditing && (
                                <button
                                    className="btn btn-light btn-sm"
                                    onClick={() => setIsEditing(true)}
                                >
                                    <i className="bi bi-pencil"></i> Edit Profile
                                </button>
                            )}
                        </div>
                        <div className="card-body">
                            {message && (
                                <div className="alert alert-success" role="alert">
                                    {message}
                                </div>
                            )}

                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            {isEditing ? (
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="fullName" className="form-label">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                                            id="fullName"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            required
                                        />
                                        {errors.fullName && (
                                            <div className="invalid-feedback">{errors.fullName}</div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="phone" className="form-label">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
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
                                        />
                                    </div>

                                    <div className="d-flex gap-2">
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Saving...
                                                </>
                                            ) : (
                                                'Save Changes'
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => {
                                                setIsEditing(false);
                                                setFormData({
                                                    fullName: profile.fullName || '',
                                                    phone: profile.phone || '',
                                                    address: profile.address || '',
                                                });
                                                setErrors({});
                                                setMessage('');
                                                setError('');
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div>
                                    <div className="row mb-3">
                                        <div className="col-md-4 fw-bold">Username</div>
                                        <div className="col-md-8">{profile.username}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-4 fw-bold">Email</div>
                                        <div className="col-md-8">{profile.email}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-4 fw-bold">Full Name</div>
                                        <div className="col-md-8">{profile.fullName || 'N/A'}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-4 fw-bold">Phone</div>
                                        <div className="col-md-8">{profile.phone || 'N/A'}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-4 fw-bold">Address</div>
                                        <div className="col-md-8">{profile.address || 'N/A'}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-4 fw-bold">Role</div>
                                        <div className="col-md-8">
                                            <span className="badge bg-info">{profile.role}</span>
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-4 fw-bold">Status</div>
                                        <div className="col-md-8">
                                            <span className={`badge ${profile.userStatus === 'ACTIVE' ? 'bg-success' : 'bg-danger'}`}>
                                                {profile.userStatus}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4 fw-bold">Joined</div>
                                        <div className="col-md-8">
                                            {new Date(profile.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;