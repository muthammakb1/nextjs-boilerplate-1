import { useState, useRef, useEffect, useCallback } from 'react';

import { cn } from '@indigo-shared-lib/utils';

export function Popover({
  children,
  trigger,
  title,
  position = 'bottom',
  triggerAction = 'click',
  open: controlledOpen,
  onOpenChange,
  className,
  contentProps,
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const popoverRef = useRef(null);
  const triggerRef = useRef(null);

  const setOpen = useCallback(
    (value) => {
      if (controlledOpen === undefined) {
        setInternalOpen(value);
      }
      onOpenChange?.(value);
    },
    [controlledOpen, onOpenChange],
  );

  const handleToggle = useCallback(() => {
    if (triggerAction === 'click') {
      setOpen(!isOpen);
    }
  }, [triggerAction, isOpen, setOpen]);

  const handleMouseEnter = useCallback(() => {
    if (triggerAction === 'hover') {
      setOpen(true);
    }
  }, [triggerAction, setOpen]);

  const handleMouseLeave = useCallback(() => {
    if (triggerAction === 'hover') {
      setOpen(false);
    }
  }, [triggerAction, setOpen]);

  useEffect(() => {
    if (triggerAction !== 'click' || !isOpen) return;

    const handleClickOutside = (event) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, triggerAction, setOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, setOpen]);

  return (
    <div
      className={cn('indigo-popover', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={triggerRef}
        className="indigo-popover__trigger"
        onClick={handleToggle}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-haspopup="true"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
          }
        }}
      >
        {trigger}
      </div>
      {isOpen && (
        <div
          ref={popoverRef}
          className={cn('indigo-popover__content', `indigo-popover__content--${position}`)}
          role="dialog"
          aria-label={title}
          {...contentProps}
        >
          {title && <div className="indigo-popover__title">{title}</div>}
          <div className="indigo-popover__body">{children}</div>
        </div>
      )}
    </div>
  );
}

Popover.displayName = 'Popover';
