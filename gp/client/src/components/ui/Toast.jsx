// client/src/components/ui/Toast.jsx
// Lightweight toast notification system.
// Usage: const { showToast } = useToast();
//        showToast('Goal saved!', 'success');

import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

const ICONS = {
  success: { icon: 'ti-circle-check', color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
  error:   { icon: 'ti-circle-x',     color: 'text-red-600',   bg: 'bg-red-50 border-red-200'     },
  warning: { icon: 'ti-alert-circle',  color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
  info:    { icon: 'ti-info-circle',   color: 'text-blue-600',  bg: 'bg-blue-50 border-blue-200'   },
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container — bottom-right */}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => {
          const style = ICONS[t.type] || ICONS.info;
          return (
            <div
              key={t.id}
              className={`flex items-start gap-2.5 min-w-[280px] max-w-sm px-4 py-3 rounded-lg border shadow-md pointer-events-auto animate-in slide-in-from-right-4 duration-200 ${style.bg}`}
            >
              <i className={`ti ${style.icon} text-[18px] mt-0.5 flex-shrink-0 ${style.color}`} aria-hidden="true" />
              <p className="text-[13px] text-gray-800 flex-1">{t.message}</p>
              <button
                onClick={() => dismiss(t.id)}
                className="text-gray-400 hover:text-gray-600 flex-shrink-0"
              >
                <i className="ti ti-x text-[14px]" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be inside <ToastProvider>');
  return ctx;
};
