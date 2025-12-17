import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useBookmarkStore } from '../stores/bookmarkStore';
import { useToastStore } from '../stores/toastStore';
import { BookmarkCard } from '../components/BookmarkCard';
import './Bookmarks.css';

export function Bookmarks() {
    const { bookmarks, isLoading, error, fetchBookmarks, deleteBookmark } = useBookmarkStore();
    const { addToast } = useToastStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');

    useEffect(() => {
        fetchBookmarks();
    }, [fetchBookmarks]);

    const handleDelete = async (id: number) => {
        if (window.confirm('Bạn có chắc muốn xóa bookmark này?')) {
            try {
                await deleteBookmark(id);
                addToast('Đã xóa bookmark thành công', 'success');
            } catch {
                addToast('Không thể xóa bookmark', 'error');
            }
        }
    };

    const filteredBookmarks = useMemo(() => {
        let result = [...bookmarks];

        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (b) =>
                    b.title.toLowerCase().includes(query) ||
                    b.description?.toLowerCase().includes(query) ||
                    b.link.toLowerCase().includes(query)
            );
        }

        // Sort
        switch (sortBy) {
            case 'newest':
                result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
            case 'oldest':
                result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                break;
            case 'title':
                result.sort((a, b) => a.title.localeCompare(b.title));
                break;
        }

        return result;
    }, [bookmarks, searchQuery, sortBy]);

    if (isLoading && bookmarks.length === 0) {
        return (
            <div className="bookmarks-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Đang tải...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bookmarks-container">
            <div className="bookmarks-header">
                <div>
                    <h1>Bookmarks của bạn</h1>
                    <p>Quản lý tất cả các liên kết yêu thích ({bookmarks.length} bookmarks)</p>
                </div>
                <Link to="/bookmarks/create" className="btn-create">
                    + Thêm mới
                </Link>
            </div>

            {/* Search and Filter */}
            <div className="bookmarks-toolbar">
                <div className="search-box">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Tìm kiếm bookmark..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="search-clear">
                            ×
                        </button>
                    )}
                </div>

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="sort-select"
                >
                    <option value="newest">Mới nhất</option>
                    <option value="oldest">Cũ nhất</option>
                    <option value="title">Theo tên A-Z</option>
                </select>
            </div>

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            {filteredBookmarks.length === 0 ? (
                <div className="empty-state">
                    {searchQuery ? (
                        <>
                            <span className="empty-icon">🔍</span>
                            <h2>Không tìm thấy bookmark</h2>
                            <p>Không có kết quả cho "{searchQuery}"</p>
                            <button onClick={() => setSearchQuery('')} className="btn-create">
                                Xóa bộ lọc
                            </button>
                        </>
                    ) : (
                        <>
                            <span className="empty-icon">📚</span>
                            <h2>Chưa có bookmark nào</h2>
                            <p>Bắt đầu lưu các liên kết yêu thích của bạn</p>
                            <Link to="/bookmarks/create" className="btn-create">
                                Tạo bookmark đầu tiên
                            </Link>
                        </>
                    )}
                </div>
            ) : (
                <div className="bookmarks-grid">
                    {filteredBookmarks.map((bookmark) => (
                        <BookmarkCard
                            key={bookmark.id}
                            bookmark={bookmark}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
