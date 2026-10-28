import { forwardRef } from 'react';

import { cn } from '@indigo-shared-lib/utils';

export const Input = forwardRef(
  (
    {
      label,
      helperText,
      error,
      size = 'md',
      fullWidth = false,
      startAdornment,
      endAdornment,
      className,
      id,
      ...props
    },
    ref,
  ) => {
    const inputId =
      id || (label ? `indigo-input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className={cn('indigo-input-wrapper', fullWidth && 'indigo-input-wrapper--full-width')}>
        {label && (
          <label className="indigo-input__label" htmlFor={inputId}>
            {label}
          </label>
        )}
        <div
          className={cn(
            'indigo-input__container',
            `indigo-input__container--${size}`,
            error && 'indigo-input__container--error',
          )}
        >
          {startAdornment && (
            <span className="indigo-input__adornment--start">{startAdornment}</span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn('indigo-input', className)}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />
          {endAdornment && <span className="indigo-input__adornment--end">{endAdornment}</span>}
        </div>
        {error && (
          <p className="indigo-input__error" id={`${inputId}-error`} role="alert">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p className="indigo-input__helper" id={`${inputId}-helper`}>
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
