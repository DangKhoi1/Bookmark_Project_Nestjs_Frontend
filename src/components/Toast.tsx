import { useToastStore } from '../stores/toastStore';
import './Toast.css';

export function ToastContainer() {
    const { toasts, removeToast } = useToastStore();

    if (toasts.length === 0) return null;

    return (
        <div className="toast-container">
            {toasts.map((toast) => (
                <div key={toast.id} className={`toast toast-${toast.type}`}>
                    <span className="toast-icon">
                        {toast.type === 'success' && '✓'}
                        {toast.type === 'error' && '✕'}
                        {toast.type === 'warning' && '⚠'}
                        {toast.type === 'info' && 'ℹ'}
                    </span>
                    <span className="toast-message">{toast.message}</span>
                    <button
                        onClick={() => removeToast(toast.id)}
                        className="toast-close"
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
}
