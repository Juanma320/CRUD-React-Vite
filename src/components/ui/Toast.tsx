import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import { useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { Toast } from '../../types/toast';
import { ToastContext } from '../../contexts/ToastContext';

interface ToastProviderProps {
  readonly children: ReactNode;
}

const createToastHandlers = (setToasts: React.Dispatch<React.SetStateAction<Toast[]>>) => {
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 11);
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => removeToast(id), 5000);
  };

  return { addToast, removeToast };
};

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const contextValue = useMemo(() => createToastHandlers(setToasts), []);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {toasts.map(toast => (
            <ToastComponent key={toast.id} toast={toast} onRemove={contextValue.removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

interface ToastComponentProps {
  readonly toast: Toast;
  readonly onRemove: (id: string) => void;
}

function ToastComponent({ toast, onRemove }: ToastComponentProps) {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-500" />
  };

  const colors: Record<Toast['type'], string> = {
    success: 'from-green-500/20 to-emerald-500/20 border-green-200',
    error: 'from-red-500/20 to-pink-500/20 border-red-200',
    warning: 'from-yellow-500/20 to-orange-500/20 border-yellow-200'
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={`
        backdrop-blur-xl bg-gradient-to-r ${colors[toast.type]} 
        border rounded-xl shadow-2xl p-4 min-w-80 max-w-md
      `}
    >
      <div className="flex items-start gap-3">
        {icons[toast.type]}
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{toast.title}</h4>
          {toast.message && (
            <p className="text-sm text-gray-600 mt-1">{toast.message}</p>
          )}
        </div>
        <button
          onClick={() => onRemove(toast.id)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
}