import { Link } from 'react-router-dom';
import type { Bookmark } from '../types';
import { FavoriteButton } from './FavoriteButton';
import './BookmarkCard.css';

interface BookmarkCardProps {
    bookmark: Bookmark;
    onDelete: (id: number) => void;
    onToggleFavorite: (id: number) => void;
    viewMode?: 'grid' | 'list';
}

export function BookmarkCard({ bookmark, onDelete, onToggleFavorite, viewMode = 'grid' }: BookmarkCardProps) {
    const getDomain = (url: string) => {
        try {
            return new URL(url).hostname;
        } catch {
            return url;
        }
    };

    return (
        <div className={`bookmark-card ${viewMode}`}>
            <div className="bookmark-header">
                <div className="bookmark-favicon">
                    <img
                        src={`https://www.google.com/s2/favicons?domain=${getDomain(bookmark.link)}&sz=32`}
                        alt=""
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23667eea"><path d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zm0 2v14h14V5H5z"/></svg>';
                        }}
                    />
                </div>
                <div className="bookmark-info">
                    <h3 className="bookmark-title">{bookmark.title}</h3>
                    <span className="bookmark-domain">{getDomain(bookmark.link)}</span>
                </div>
                <FavoriteButton
                    isFavorite={bookmark.isFavorite}
                    onToggle={() => onToggleFavorite(bookmark.id)}
                    size="medium"
                />
            </div>

            {bookmark.description && (
                <p className="bookmark-description">{bookmark.description}</p>
            )}

            {/* Category badge */}
            {bookmark.category && (
                <div
                    className="bookmark-category"
                    style={{ backgroundColor: bookmark.category.color }}
                >
                    <span>{bookmark.category.icon}</span>
                    <span>{bookmark.category.name}</span>
                </div>
            )}

            {/* Tags */}
            {bookmark.tags && bookmark.tags.length > 0 && (
                <div className="bookmark-tags">
                    {bookmark.tags.map((tag) => (
                        <span key={tag.id} className="tag">
                            {tag.name}
                        </span>
                    ))}
                </div>
            )}

            <div className="bookmark-footer">
                <a
                    href={bookmark.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-visit"
                >
                    Truy cập ↗
                </a>
                <div className="bookmark-actions">
                    <Link to={`/bookmarks/edit/${bookmark.id}`} className="btn-edit">
                        Sửa
                    </Link>
                    <button
                        onClick={() => onDelete(bookmark.id)}
                        className="btn-delete"
                    >
                        Xóa
                    </button>
                </div>
            </div>
        </div>
    );
}
