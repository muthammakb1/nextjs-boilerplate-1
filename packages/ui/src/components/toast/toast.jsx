import { useState, useCallback, useEffect, useRef } from 'react';

import { cn, generateId } from '@indigo-shared-lib/utils';

let globalAddToast = null;

/**
 * Programmatic toast trigger. Requires ToastProvider in the tree.
 */
export const toast = {
  show: (options) => globalAddToast?.(options),
  info: (message, opts) => globalAddToast?.({ message, variant: 'info', ...opts }),
  success: (message, opts) => globalAddToast?.({ message, variant: 'success', ...opts }),
  warning: (message, opts) => globalAddToast?.({ message, variant: 'warning', ...opts }),
  error: (message, opts) => globalAddToast?.({ message, variant: 'error', ...opts }),
};

export function ToastProvider({ children, maxToasts = 5, position = 'top-right' }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  const removeToast = useCallback((id) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (options) => {
      const id = generateId('toast');
      const duration = options.duration ?? 5000;

      setToasts((prev) => {
        const next = [...prev, { ...options, id }];
        return next.slice(-maxToasts);
      });

      if (duration > 0) {
        const timer = setTimeout(() => removeToast(id), duration);
        timersRef.current.set(id, timer);
      }
    },
    [maxToasts, removeToast],
  );

  useEffect(() => {
    globalAddToast = addToast;
    return () => {
      globalAddToast = null;
    };
  }, [addToast]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  return (
    <>
      {children}
      {toasts.length > 0 && (
        <div className={cn('indigo-toast-container', `indigo-toast-container--${position}`)}>
          {toasts.map((t) => (
            <div
              key={t.id}
              className={cn('indigo-toast', `indigo-toast--${t.variant || 'info'}`)}
              role="alert"
            >
              <span className="indigo-toast__message">{t.message}</span>
              <div className="indigo-toast__actions">
                {t.action && (
                  <button className="indigo-toast__action" onClick={t.action.onClick} type="button">
                    {t.action.label}
                  </button>
                )}
                <button
                  className="indigo-toast__dismiss"
                  onClick={() => removeToast(t.id)}
                  aria-label="Dismiss"
                  type="button"
                >
                  &#x2715;
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

ToastProvider.displayName = 'ToastProvider';
