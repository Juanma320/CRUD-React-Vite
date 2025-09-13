export type ToastType = 'success' | 'error' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

export interface ToastContextType {
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}