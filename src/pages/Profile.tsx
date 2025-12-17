import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useAuthStore } from '../stores/authStore';
import './Profile.css';

export function Profile() {
    const { user, updateUser, isLoading, error, clearError, fetchUser } = useAuthStore();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!user) {
            fetchUser();
        }
    }, [user, fetchUser]);

    useEffect(() => {
        if (user) {
            setFirstName(user.firstName || '');
            setLastName(user.lastName || '');
            setEmail(user.email);
        }
    }, [user]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSuccess(false);
        clearError();

        try {
            await updateUser({
                firstName: firstName || undefined,
                lastName: lastName || undefined,
                email: email !== user?.email ? email : undefined,
            });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch {
        }
    };

    if (!user) {
        return (
            <div className="profile-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Đang tải...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="profile-avatar">
                        {user.email.charAt(0).toUpperCase()}
                    </div>
                    <h1>Thông tin cá nhân</h1>
                    <p>Cập nhật thông tin tài khoản của bạn</p>
                </div>

                {error && (
                    <div className="alert alert-error">{error}</div>
                )}

                {success && (
                    <div className="alert alert-success">
                        Cập nhật thành công!
                    </div>
                )}

                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="firstName">Họ</label>
                            <input
                                type="text"
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Nhập họ của bạn"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="lastName">Tên</label>
                            <input
                                type="text"
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Nhập tên của bạn"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="profile-info">
                        <div className="info-item">
                            <span className="info-label">Ngày tạo</span>
                            <span className="info-value">{new Date(user.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Cập nhật lần cuối</span>
                            <span className="info-value">{new Date(user.updatedAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                    </div>

                    <button type="submit" className="btn-submit" disabled={isLoading}>
                        {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                </form>
            </div>
        </div>
    );
}
