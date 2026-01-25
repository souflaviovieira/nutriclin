
import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const showToast = useCallback((message: string, type: ToastType = 'success') => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto-remove after 4s
        setTimeout(() => removeToast(id), 4000);
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast Container */}
            <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className="flex items-center gap-3 px-5 py-4 bg-white border-2 rounded-2xl shadow-xl animate-in slide-in-from-right-10 duration-300 pointer-events-auto min-w-[300px] max-w-md"
                        style={{
                            borderColor: toast.type === 'success' ? '#FF8A65' : toast.type === 'error' ? '#EF4444' : '#64748B',
                            backgroundColor: '#FFFCFA' // Creme background
                        }}
                    >
                        <div className={toast.type === 'success' ? 'text-coral-500' : toast.type === 'error' ? 'text-red-500' : 'text-slate-500'}>
                            {toast.type === 'success' && <CheckCircle2 size={24} />}
                            {toast.type === 'error' && <AlertCircle size={24} />}
                            {toast.type === 'info' && <Info size={24} />}
                        </div>

                        <p className="flex-1 text-sm font-bold text-slate-800 leading-tight">
                            {toast.message}
                        </p>

                        <button
                            onClick={() => removeToast(toast.id)}
                            className="text-slate-300 hover:text-slate-500 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within a ToastProvider');
    return context;
};
