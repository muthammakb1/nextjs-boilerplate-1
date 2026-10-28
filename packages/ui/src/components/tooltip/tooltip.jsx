import { useState, useRef, useEffect } from 'react';

import { cn } from '@indigo-shared-lib/utils';

export function Tooltip({ content, children, position = 'top', delay = 200, className }) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef();

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className={cn('indigo-tooltip-wrapper', className)}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {isVisible && (
        <div className={cn('indigo-tooltip', `indigo-tooltip--${position}`)} role="tooltip">
          {content}
        </div>
      )}
    </div>
  );
}

Tooltip.displayName = 'Tooltip';
