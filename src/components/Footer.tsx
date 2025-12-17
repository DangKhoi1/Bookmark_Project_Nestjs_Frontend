import './Footer.css';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <span className="footer-logo">🔖</span>
                    <span className="footer-name">Bookmark Manager</span>
                </div>

                <div className="footer-links">
                    <a href="#" className="footer-link">Về chúng tôi</a>
                    <a href="#" className="footer-link">Liên hệ</a>
                    <a href="#" className="footer-link">Điều khoản</a>
                    <a href="#" className="footer-link">Bảo mật</a>
                </div>

                <div className="footer-copyright">
                    © {currentYear} Bookmark Manager. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
