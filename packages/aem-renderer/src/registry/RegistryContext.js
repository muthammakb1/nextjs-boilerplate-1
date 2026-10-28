'use client';

import { createContext, useContext } from 'react';

/**
 * React context for the component registry.
 *
 * When using <AemPageRenderer>, the registry is automatically provided.
 * Child components can access it via useRegistry() if needed.
 */
const RegistryContext = createContext(null);

export function RegistryProvider({ registry, children }) {
  return <RegistryContext.Provider value={registry}>{children}</RegistryContext.Provider>;
}

/**
 * Access the current component registry from context.
 * @returns {Registry | null}
 */
export function useRegistry() {
  return useContext(RegistryContext);
}

export default RegistryContext;
