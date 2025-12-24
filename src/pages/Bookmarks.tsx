import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useBookmarkStore } from '../stores/bookmarkStore';
import { useToastStore } from '../stores/toastStore';
import { BookmarkCard } from '../components/BookmarkCard';
import { CategorySidebar } from '../components/CategorySidebar';
import { ViewToggle } from '../components/ViewToggle';
import './Bookmarks.css';

export function Bookmarks() {
    const {
        bookmarks,
        pagination,
        filters,
        isLoading,
        error,
        fetchBookmarks,
        deleteBookmark,
        toggleFavorite,
        setFilters
    } = useBookmarkStore();
    const { addToast } = useToastStore();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchInput, setSearchInput] = useState('');
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

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

    const handleToggleFavorite = async (id: number) => {
        await toggleFavorite(id);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setFilters({ search: searchInput });
    };

    const handleCategorySelect = (categoryId: number | undefined) => {
        setShowFavoritesOnly(false);
        setFilters({ categoryId, isFavorite: undefined });
    };

    const handleToggleFavorites = () => {
        const newValue = !showFavoritesOnly;
        setShowFavoritesOnly(newValue);
        setFilters({
            isFavorite: newValue ? true : undefined,
            categoryId: undefined
        });
    };

    const handleSortChange = (sortBy: 'newest' | 'oldest' | 'title') => {
        setFilters({ sortBy });
    };

    const handlePageChange = (page: number) => {
        setFilters({ ...filters, page });
    };

    const clearSearch = () => {
        setSearchInput('');
        setFilters({ search: undefined });
    };

    if (isLoading && bookmarks.length === 0) {
        return (
            <div className="bookmarks-page">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Đang tải...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bookmarks-page">
            <CategorySidebar
                selectedCategoryId={filters.categoryId}
                onSelectCategory={handleCategorySelect}
                showFavorites={true}
                onToggleFavorites={handleToggleFavorites}
                isFavoritesActive={showFavoritesOnly}
            />

            <div className="bookmarks-main">
                <div className="bookmarks-header">
                    <div>
                        <h1>
                            {showFavoritesOnly
                                ? '⭐ Yêu thích'
                                : filters.categoryId
                                    ? 'Bookmarks trong category'
                                    : 'Tất cả Bookmarks'}
                        </h1>
                        <p>
                            {pagination?.total || 0} bookmarks
                            {filters.search && ` • Tìm kiếm: "${filters.search}"`}
                        </p>
                    </div>
                    <Link to="/bookmarks/create" className="btn-create">
                        + Thêm mới
                    </Link>
                </div>

                {/* Search and Filter */}
                <div className="bookmarks-toolbar">
                    <form className="search-box" onSubmit={handleSearch}>
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Tìm kiếm bookmark..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="search-input"
                        />
                        {searchInput && (
                            <button type="button" onClick={clearSearch} className="search-clear">
                                ×
                            </button>
                        )}
                    </form>

                    <div className="toolbar-right">
                        <select
                            value={filters.sortBy || 'newest'}
                            onChange={(e) => handleSortChange(e.target.value as 'newest' | 'oldest' | 'title')}
                            className="sort-select"
                        >
                            <option value="newest">Mới nhất</option>
                            <option value="oldest">Cũ nhất</option>
                            <option value="title">Theo tên A-Z</option>
                        </select>

                        <ViewToggle view={viewMode} onChange={setViewMode} />
                    </div>
                </div>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                {bookmarks.length === 0 ? (
                    <div className="empty-state">
                        {filters.search ? (
                            <>
                                <span className="empty-icon">🔍</span>
                                <h2>Không tìm thấy bookmark</h2>
                                <p>Không có kết quả cho "{filters.search}"</p>
                                <button onClick={clearSearch} className="btn-create">
                                    Xóa bộ lọc
                                </button>
                            </>
                        ) : showFavoritesOnly ? (
                            <>
                                <span className="empty-icon">⭐</span>
                                <h2>Chưa có bookmark yêu thích</h2>
                                <p>Click vào dấu sao để thêm bookmark vào mục yêu thích</p>
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
                    <>
                        <div className={`bookmarks-grid ${viewMode}`}>
                            {bookmarks.map((bookmark) => (
                                <BookmarkCard
                                    key={bookmark.id}
                                    bookmark={bookmark}
                                    onDelete={handleDelete}
                                    onToggleFavorite={handleToggleFavorite}
                                    viewMode={viewMode}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    className="page-btn"
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={pagination.page <= 1}
                                >
                                    ← Trước
                                </button>
                                <span className="page-info">
                                    Trang {pagination.page} / {pagination.totalPages}
                                </span>
                                <button
                                    className="page-btn"
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={pagination.page >= pagination.totalPages}
                                >
                                    Sau →
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
