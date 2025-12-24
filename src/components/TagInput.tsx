import { useState, useRef, useEffect } from 'react';
import type { Tag } from '../types';
import './TagInput.css';

interface TagInputProps {
    selectedTags: string[];
    onChange: (tags: string[]) => void;
    suggestions?: Tag[];
    placeholder?: string;
}

export function TagInput({
    selectedTags,
    onChange,
    suggestions = [],
    placeholder = 'Thêm tags...'
}: TagInputProps) {
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Filter suggestions based on input and exclude already selected
    const filteredSuggestions = suggestions.filter(
        (tag) =>
            tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
            !selectedTags.includes(tag.name)
    );

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const addTag = (tagName: string) => {
        const trimmed = tagName.trim().toLowerCase();
        if (trimmed && !selectedTags.includes(trimmed)) {
            onChange([...selectedTags, trimmed]);
        }
        setInputValue('');
        setShowSuggestions(false);
        inputRef.current?.focus();
    };

    const removeTag = (tagName: string) => {
        onChange(selectedTags.filter((t) => t !== tagName));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(inputValue);
        } else if (e.key === 'Backspace' && !inputValue && selectedTags.length > 0) {
            removeTag(selectedTags[selectedTags.length - 1]);
        }
    };

    return (
        <div className="tag-input-container" ref={containerRef}>
            <div className="tag-input-wrapper">
                {selectedTags.map((tag) => (
                    <span key={tag} className="tag-chip">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)}>×</button>
                    </span>
                ))}
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={selectedTags.length === 0 ? placeholder : ''}
                    className="tag-input"
                />
            </div>

            {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="tag-suggestions">
                    {filteredSuggestions.slice(0, 8).map((tag) => (
                        <button
                            key={tag.id}
                            type="button"
                            className="tag-suggestion"
                            onClick={() => addTag(tag.name)}
                        >
                            <span className="tag-name">{tag.name}</span>
                            <span className="tag-count">{tag._count?.bookmarks || 0}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
