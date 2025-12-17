import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import './Auth.css';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading, error, clearError } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await login({ email, password });
            navigate('/bookmarks');
        } catch {
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <span className="auth-icon">🔖</span>
                    <h1>Đăng nhập</h1>
                    <p>Chào mừng bạn quay trở lại</p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        {error}
                        <button onClick={clearError} className="alert-close">×</button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
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

                    <div className="form-group">
                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button type="submit" className="btn-submit" disabled={isLoading}>
                        {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
                    </button>
                </form>

                <p className="auth-footer">
                    Chưa có tài khoản? <Link to="/signup">Đăng ký ngay</Link>
                </p>
            </div>
        </div>
    );
}
