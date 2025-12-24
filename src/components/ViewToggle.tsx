import './ViewToggle.css';

interface ViewToggleProps {
    view: 'grid' | 'list';
    onChange: (view: 'grid' | 'list') => void;
}

export function ViewToggle({ view, onChange }: ViewToggleProps) {
    return (
        <div className="view-toggle">
            <button
                className={`view-btn ${view === 'grid' ? 'active' : ''}`}
                onClick={() => onChange('grid')}
                title="Grid view"
            >
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
            </button>
            <button
                className={`view-btn ${view === 'list' ? 'active' : ''}`}
                onClick={() => onChange('list')}
                title="List view"
            >
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <rect x="3" y="4" width="18" height="4" rx="1" />
                    <rect x="3" y="10" width="18" height="4" rx="1" />
                    <rect x="3" y="16" width="18" height="4" rx="1" />
                </svg>
            </button>
        </div>
    );
}
