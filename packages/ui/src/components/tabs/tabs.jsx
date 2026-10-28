import { useState, createContext, useContext, useCallback } from 'react';

import { cn } from '@indigo-shared-lib/utils';

const TabsContext = createContext(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tabs components must be used within <Tabs>');
  return ctx;
}

export function Tabs({ defaultValue, value, onChange, children, className }) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const activeTab = value !== undefined ? value : internalValue;

  const setActiveTab = useCallback(
    (id) => {
      if (value === undefined) setInternalValue(id);
      onChange?.(id);
    },
    [value, onChange],
  );

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn('indigo-tabs', className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabList({ children, className }) {
  return (
    <div className={cn('indigo-tab-list', className)} role="tablist">
      {children}
    </div>
  );
}

export function Tab({ value, children, disabled = false, className }) {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <button
      className={cn(
        'indigo-tab',
        isActive && 'indigo-tab--active',
        disabled && 'indigo-tab--disabled',
        className,
      )}
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabpanel-${value}`}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      onClick={() => !disabled && setActiveTab(value)}
      type="button"
    >
      {children}
    </button>
  );
}

export function TabPanel({ value, children, className }) {
  const { activeTab } = useTabsContext();
  if (activeTab !== value) return null;

  return (
    <div className={cn('indigo-tab-panel', className)} role="tabpanel" id={`tabpanel-${value}`}>
      {children}
    </div>
  );
}

Tabs.displayName = 'Tabs';
TabList.displayName = 'TabList';
Tab.displayName = 'Tab';
TabPanel.displayName = 'TabPanel';
