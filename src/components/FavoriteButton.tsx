import { useState } from 'react';
import './FavoriteButton.css';

interface FavoriteButtonProps {
    isFavorite: boolean;
    onToggle: () => void;
    size?: 'small' | 'medium' | 'large';
}

export function FavoriteButton({ isFavorite, onToggle, size = 'medium' }: FavoriteButtonProps) {
    const [isAnimating, setIsAnimating] = useState(false);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsAnimating(true);
        onToggle();
        setTimeout(() => setIsAnimating(false), 300);
    };

    return (
        <button
            className={`favorite-btn ${isFavorite ? 'active' : ''} ${isAnimating ? 'animating' : ''} size-${size}`}
            onClick={handleClick}
            title={isFavorite ? 'Bỏ yêu thích' : 'Yêu thích'}
        >
            <span className="star-icon">{isFavorite ? '★' : '☆'}</span>
        </button>
    );
}
