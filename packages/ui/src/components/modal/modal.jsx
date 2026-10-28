import { useEffect, useRef, useCallback } from 'react';

import { cn } from '@indigo-shared-lib/utils';

/**
 * Modal
 *
 * Props
 * ─────────────────────────────────────────────────────────────────
 * enterFrom       'center' | 'left' | 'right' | 'bottom'   (default 'center')
 *   Controls slide-in direction.
 *   • center – scale-fade in from the viewport centre (existing behaviour)
 *   • left   – full-height drawer that slides in from the left edge
 *   • right  – full-height drawer that slides in from the right edge
 *   • bottom – bottom sheet that slides up from the bottom edge
 *
 * closePosition   'header-right' | 'header-left' | 'top-center'   (default 'header-right')
 *   Controls where the close (×) button is rendered.
 *   • header-right  – close button at the trailing end of the header (existing behaviour)
 *   • header-left   – close button at the leading end of the header
 *   • top-center    – close button floats above and centred over the panel
 * ─────────────────────────────────────────────────────────────────
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  size = 'md',
  enterFrom = 'center',
  closePosition = 'header-right',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  footer,
  className,
  contentProps,
}) {
  const dialogRef = useRef(null);

  const handleEscape = useCallback(
    (event) => {
      if (event.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    },
    [onClose, closeOnEscape],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      dialogRef.current?.focus();
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [open, handleEscape]);

  if (!open) return null;

  const isTopCenter = closePosition === 'top-center';
  // Show the in-panel header when there is a title OR when the close button lives inside it.
  const showPanelHeader =
    title != null || closePosition === 'header-left' || closePosition === 'header-right';

  const overlayClass = cn('indigo-modal__overlay', `indigo-modal__overlay--enter-${enterFrom}`);

  const panelClass = cn(
    'indigo-modal',
    `indigo-modal--${size}`,
    `indigo-modal--enter-${enterFrom}`,
    className,
  );

  // Inline close button shared between header-left / header-right positions.
  const inlineCloseBtn = (
    <button
      className="indigo-modal__close"
      onClick={onClose}
      aria-label="Close modal"
      type="button"
    >
      &#x2715;
    </button>
  );

  // ── top-center variant: close button floats above the panel ──────────────
  if (isTopCenter) {
    return (
      <div className={overlayClass} onClick={closeOnOverlayClick ? onClose : undefined}>
        {/* Wrapper stops click bubbling so only the backdrop triggers onClose */}
        <div className="indigo-modal__top-close-wrapper" onClick={(e) => e.stopPropagation()}>
          <button
            className="indigo-modal__close indigo-modal__close--top-center"
            onClick={onClose}
            aria-label="Close modal"
            type="button"
          >
            &#x2715;
          </button>
          <div
            ref={dialogRef}
            className={panelClass}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            {...contentProps}
          >
            {title && (
              <div className="indigo-modal__header indigo-modal__header--title-only">
                <h2 className="indigo-modal__title">{title}</h2>
              </div>
            )}
            <div className="indigo-modal__body">{children}</div>
            {footer && <div className="indigo-modal__footer">{footer}</div>}
          </div>
        </div>
      </div>
    );
  }

  // ── header-left / header-right variants ──────────────────────────────────
  return (
    <div className={overlayClass} onClick={closeOnOverlayClick ? onClose : undefined}>
      <div
        ref={dialogRef}
        className={panelClass}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        {...contentProps}
      >
        {showPanelHeader && (
          <div
            className={cn(
              'indigo-modal__header',
              closePosition === 'header-left' && 'indigo-modal__header--close-left',
            )}
          >
            {closePosition === 'header-left' && inlineCloseBtn}
            {title && <h2 className="indigo-modal__title">{title}</h2>}
            {closePosition === 'header-right' && inlineCloseBtn}
          </div>
        )}
        <div className="indigo-modal__body">{children}</div>
        {footer && <div className="indigo-modal__footer">{footer}</div>}
      </div>
    </div>
  );
}

Modal.displayName = 'Modal';
