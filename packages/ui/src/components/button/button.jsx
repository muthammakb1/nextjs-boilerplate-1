import { forwardRef } from 'react';

import { cn } from '@indigo-shared-lib/utils';

export const Button = forwardRef(
  (
    {
      children,
      variant,
      size,
      fullWidth = false,
      pill = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      iconSrc,
      iconAlt = '',
      iconClassName = 'indigo-btn__icon-img',
      iconPosition = 'right',
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    const iconElement = iconSrc ? (
      <img
        src={iconSrc}
        alt={iconAlt}
        className={iconClassName || undefined}
        aria-hidden={!iconAlt || undefined}
      />
    ) : null;

    const resolvedLeftIcon = iconElement && iconPosition === 'left' ? iconElement : leftIcon;
    const resolvedRightIcon = iconElement && iconPosition === 'right' ? iconElement : rightIcon;

    return (
      <button
        ref={ref}
        className={cn(
          'indigo-btn',
          variant && `indigo-btn--${variant}`,
          size && `indigo-btn--${size}`,
          fullWidth && 'indigo-btn--full-width',
          pill && 'indigo-btn--pill',
          isLoading && 'indigo-btn--loading',
          className,
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <span className="indigo-btn__spinner" aria-hidden="true" />}
        {!isLoading && resolvedLeftIcon && (
          <span className="indigo-btn__icon--left">{resolvedLeftIcon}</span>
        )}
        <span className="indigo-btn__content">{children}</span>
        {!isLoading && resolvedRightIcon && (
          <span className="indigo-btn__icon--right">{resolvedRightIcon}</span>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
