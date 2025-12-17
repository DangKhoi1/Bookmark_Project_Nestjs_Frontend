import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBookmarkStore } from '../stores/bookmarkStore';
import './BookmarkForm.css';

export function CreateBookmark() {
    const [title, setTitle] = useState('');
    const [link, setLink] = useState('');
    const [description, setDescription] = useState('');
    const { createBookmark, isLoading, error } = useBookmarkStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await createBookmark({ title, link, description: description || undefined });
            navigate('/bookmarks');
        } catch {
        }
    };

    return (
        <div className="form-container">
            <div className="form-card">
                <div className="form-header">
                    <Link to="/bookmarks" className="back-link">← Quay lại</Link>
                    <h1>Tạo bookmark mới</h1>
                    <p>Lưu một liên kết mới vào bộ sưu tập của bạn</p>
                </div>

                {error && (
                    <div className="alert alert-error">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="bookmark-form">
                    <div className="form-group">
                        <label htmlFor="title">Tiêu đề *</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Nhập tiêu đề bookmark"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="link">URL *</label>
                        <input
                            type="url"
                            id="link"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            placeholder="https://example.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Mô tả (tùy chọn)</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Mô tả ngắn về bookmark này..."
                            rows={3}
                        />
                    </div>

                    <div className="form-actions">
                        <Link to="/bookmarks" className="btn-cancel">Hủy</Link>
                        <button type="submit" className="btn-submit" disabled={isLoading}>
                            {isLoading ? 'Đang tạo...' : 'Tạo bookmark'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
