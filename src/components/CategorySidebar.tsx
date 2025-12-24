import { useState, useEffect } from 'react';
import { useCategoryStore } from '../stores/categoryStore';
import './CategorySidebar.css';

interface CategorySidebarProps {
    selectedCategoryId?: number;
    onSelectCategory: (categoryId: number | undefined) => void;
    showFavorites?: boolean;
    onToggleFavorites?: () => void;
    isFavoritesActive?: boolean;
}

export function CategorySidebar({
    selectedCategoryId,
    onSelectCategory,
    showFavorites = true,
    onToggleFavorites,
    isFavoritesActive = false,
}: CategorySidebarProps) {
    const { categories, fetchCategories, createCategory, deleteCategory, isLoading } = useCategoryStore();
    const [isAdding, setIsAdding] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryColor, setNewCategoryColor] = useState('#667eea');
    const [newCategoryIcon, setNewCategoryIcon] = useState('📁');

    const icons = ['📁', '💼', '🎯', '📚', '🎨', '💻', '🎮', '🎵', '📷', '✈️', '🍔', '⚽'];
    const colors = ['#667eea', '#f56565', '#48bb78', '#ed8936', '#9f7aea', '#38b2ac', '#e53e3e', '#dd6b20'];

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return;

        try {
            await createCategory({
                name: newCategoryName,
                color: newCategoryColor,
                icon: newCategoryIcon,
            });
            setNewCategoryName('');
            setIsAdding(false);
        } catch {
            // Error handled by store
        }
    };

    const handleDeleteCategory = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (window.confirm('Xóa category này? Bookmarks sẽ không bị xóa.')) {
            await deleteCategory(id);
            if (selectedCategoryId === id) {
                onSelectCategory(undefined);
            }
        }
    };

    return (
        <div className="category-sidebar">
            <div className="sidebar-header">
                <h3>📂 Categories</h3>
            </div>

            <div className="category-list">
                {/* All bookmarks */}
                <button
                    className={`category-item ${!selectedCategoryId && !isFavoritesActive ? 'active' : ''}`}
                    onClick={() => onSelectCategory(undefined)}
                >
                    <span className="category-icon">🔖</span>
                    <span className="category-name">Tất cả</span>
                </button>

                {/* Favorites */}
                {showFavorites && onToggleFavorites && (
                    <button
                        className={`category-item favorites ${isFavoritesActive ? 'active' : ''}`}
                        onClick={onToggleFavorites}
                    >
                        <span className="category-icon">⭐</span>
                        <span className="category-name">Yêu thích</span>
                    </button>
                )}

                <div className="category-divider" />

                {/* Category list */}
                {categories.map((category) => (
                    <button
                        key={category.id}
                        className={`category-item ${selectedCategoryId === category.id ? 'active' : ''}`}
                        onClick={() => onSelectCategory(category.id)}
                        style={{ '--category-color': category.color } as React.CSSProperties}
                    >
                        <span className="category-icon">{category.icon}</span>
                        <span className="category-name">{category.name}</span>
                        <span className="category-count">{category._count?.bookmarks || 0}</span>
                        <button
                            className="category-delete"
                            onClick={(e) => handleDeleteCategory(e, category.id)}
                        >
                            ×
                        </button>
                    </button>
                ))}

                {/* Add category button */}
                {!isAdding ? (
                    <button className="category-item add-btn" onClick={() => setIsAdding(true)}>
                        <span className="category-icon">+</span>
                        <span className="category-name">Thêm category</span>
                    </button>
                ) : (
                    <div className="add-category-form">
                        <input
                            type="text"
                            placeholder="Tên category"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                            autoFocus
                        />
                        <div className="icon-picker">
                            {icons.map((icon) => (
                                <button
                                    key={icon}
                                    className={`icon-option ${newCategoryIcon === icon ? 'active' : ''}`}
                                    onClick={() => setNewCategoryIcon(icon)}
                                >
                                    {icon}
                                </button>
                            ))}
                        </div>
                        <div className="color-picker">
                            {colors.map((color) => (
                                <button
                                    key={color}
                                    className={`color-option ${newCategoryColor === color ? 'active' : ''}`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => setNewCategoryColor(color)}
                                />
                            ))}
                        </div>
                        <div className="form-actions">
                            <button className="btn-cancel" onClick={() => setIsAdding(false)}>
                                Hủy
                            </button>
                            <button className="btn-save" onClick={handleAddCategory} disabled={isLoading}>
                                Lưu
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
