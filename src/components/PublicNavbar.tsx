import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import './Navbar.css';

export function PublicNavbar() {
    const { token } = useAuthStore();

    return (
        <nav className="navbar navbar-transparent">
            <div className="navbar-brand">
                <Link to="/" className="logo">
                    <span className="logo-icon">🔖</span>
                    <span className="logo-text">Bookmark</span>
                </Link>
            </div>

            <div className="navbar-menu">
                {token ? (
                    <Link to="/bookmarks" className="btn-nav-primary">
                        Dashboard →
                    </Link>
                ) : (
                    <>
                        <Link to="/login" className="nav-link">Đăng nhập</Link>
                        <Link to="/signup" className="btn-nav-primary">Đăng ký</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
