import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { PublicNavbar } from '../components/PublicNavbar';
import './Home.css';

export function Home() {
    const { token } = useAuthStore();

    return (
        <>
            <PublicNavbar />
            <div className="home-container">
                <div className="hero-section">
                    <div className="hero-content">
                        <span className="hero-icon">🔖</span>
                        <h1>Bookmark Manager</h1>
                        <p className="hero-subtitle">
                            Lưu trữ và quản lý tất cả các liên kết yêu thích của bạn một cách dễ dàng
                        </p>

                        <div className="hero-features">
                            <div className="feature">
                                <span>📚</span>
                                <span>Lưu bookmark</span>
                            </div>
                            <div className="feature">
                                <span>🔍</span>
                                <span>Tìm kiếm nhanh</span>
                            </div>
                            <div className="feature">
                                <span>🔐</span>
                                <span>Bảo mật</span>
                            </div>
                        </div>

                        <div className="hero-actions">
                            {token ? (
                                <Link to="/bookmarks" className="btn-primary">
                                    Xem Bookmarks →
                                </Link>
                            ) : (
                                <>
                                    <Link to="/signup" className="btn-primary">
                                        Bắt đầu miễn phí
                                    </Link>
                                    <Link to="/login" className="btn-secondary">
                                        Đăng nhập
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="hero-visual">
                        <div className="floating-cards">
                            <div className="card card-1">
                                <div className="card-icon">🌐</div>
                                <div className="card-text">Website</div>
                            </div>
                            <div className="card card-2">
                                <div className="card-icon">📖</div>
                                <div className="card-text">Blog</div>
                            </div>
                            <div className="card card-3">
                                <div className="card-icon">🎥</div>
                                <div className="card-text">Video</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
