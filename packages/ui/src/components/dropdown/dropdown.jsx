import { useState, useRef, useEffect, useCallback } from 'react';

import { cn } from '@indigo-shared-lib/utils';

export function Dropdown({
  options,
  value,
  placeholder = 'Select an option',
  onChange,
  label,
  error,
  disabled = false,
  size = 'md',
  fullWidth = false,
  className,
  renderSelected,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = useCallback(
    (optionValue) => {
      onChange?.(optionValue);
      setIsOpen(false);
    },
    [onChange],
  );

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (event) => {
      if (disabled) return;

      switch (event.key) {
        case 'Enter':
        case ' ':
          event.preventDefault();
          if (isOpen && highlightedIndex >= 0) {
            const option = options[highlightedIndex];
            if (option && !option.disabled) {
              handleSelect(option.value);
            }
          } else {
            setIsOpen(!isOpen);
          }
          break;
        case 'ArrowDown':
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            setHighlightedIndex((prev) => Math.min(prev + 1, options.length - 1));
          }
          break;
        case 'ArrowUp':
          event.preventDefault();
          setHighlightedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case 'Escape':
          setIsOpen(false);
          break;
      }
    },
    [disabled, isOpen, highlightedIndex, options, handleSelect],
  );

  return (
    <div
      ref={containerRef}
      className={cn('indigo-dropdown', fullWidth && 'indigo-dropdown--full-width', className)}
    >
      {label && <label className="indigo-dropdown__label">{label}</label>}
      <div
        className={cn(
          'indigo-dropdown__trigger',
          `indigo-dropdown__trigger--${size}`,
          isOpen && 'indigo-dropdown__trigger--open',
          error && 'indigo-dropdown__trigger--error',
          disabled && 'indigo-dropdown__trigger--disabled',
        )}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
      >
        <span className={cn(!selectedOption && 'indigo-dropdown__placeholder')}>
          {selectedOption
            ? renderSelected
              ? renderSelected(selectedOption)
              : selectedOption.label
            : placeholder}
        </span>
        <span className="indigo-dropdown__arrow" aria-hidden="true">
          &#x25BC;
        </span>
      </div>
      {isOpen && (
        <ul className="indigo-dropdown__menu" role="listbox">
          {options.map((option, index) => (
            <li
              key={option.value}
              className={cn(
                'indigo-dropdown__option',
                option.value === value && 'indigo-dropdown__option--selected',
                option.disabled && 'indigo-dropdown__option--disabled',
                index === highlightedIndex && 'indigo-dropdown__option--highlighted',
              )}
              role="option"
              aria-selected={option.value === value}
              aria-disabled={option.disabled}
              onClick={() => !option.disabled && handleSelect(option.value)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
      {error && (
        <p className="indigo-dropdown__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

Dropdown.displayName = 'Dropdown';
