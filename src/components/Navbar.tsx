import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import './Navbar.css';

export function Navbar() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/" className="logo">
                    <span className="logo-icon">🔖</span>
                    <span className="logo-text">Bookmark</span>
                </Link>
            </div>

            <div className="navbar-menu">
                <Link to="/" className="nav-link">Trang chủ</Link>
                <Link to="/bookmarks" className="nav-link">Bookmarks</Link>
                {user && (
                    <>
                        <Link to="/profile" className="nav-link">
                            <span className="user-avatar">
                                {user.email.charAt(0).toUpperCase()}
                            </span>
                            {user.firstName || user.email.split('@')[0]}
                        </Link>
                        <button onClick={handleLogout} className="btn-logout">
                            Đăng xuất
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}
