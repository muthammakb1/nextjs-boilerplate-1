import { useState, useCallback, useId } from 'react';

import { cn } from '@indigo-shared-lib/utils';

export function Accordion({
  items,
  allowMultiple = false,
  defaultExpanded = [],
  className,
  image,
  imageAlt = '',
  divider = false,
}) {
  const [expandedIds, setExpandedIds] = useState(new Set(defaultExpanded));
  const accordionId = useId();

  const toggleItem = useCallback(
    (id) => {
      setExpandedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          if (!allowMultiple) {
            next.clear();
          }
          next.add(id);
        }
        return next;
      });
    },
    [allowMultiple],
  );

  return (
    <div className={cn('indigo-accordion', className)}>
      {items.map((item, index) => {
        const isExpanded = expandedIds.has(item.id);
        const headerId = `${accordionId}-header-${item.id}`;
        const panelId = `${accordionId}-panel-${item.id}`;

        return (
          <div
            key={item.id}
            className={cn(
              'indigo-accordion__item',
              isExpanded && 'indigo-accordion__item--expanded',
            )}
          >
            {divider && index > 0 && <div className="indigo-accordion__divider" />}
            <button
              id={headerId}
              className="indigo-accordion__trigger"
              onClick={() => !item.disabled && toggleItem(item.id)}
              aria-expanded={isExpanded}
              aria-controls={panelId}
              disabled={item.disabled}
              type="button"
            >
              <span className="indigo-accordion__title">{item.title}</span>
              <span
                className={cn(
                  'indigo-accordion__icon',
                  isExpanded && 'indigo-accordion__icon--expanded',
                )}
                aria-hidden="true"
              >
                {image ? (
                  typeof image === 'string' ? (
                    <img src={image} alt={imageAlt} />
                  ) : (
                    image
                  )
                ) : (
                  '▼'
                )}
              </span>
            </button>
            {isExpanded && (
              <div
                id={panelId}
                className="indigo-accordion__panel"
                role="region"
                aria-labelledby={headerId}
              >
                <div className="indigo-accordion__content">{item.content}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

Accordion.displayName = 'Accordion';
