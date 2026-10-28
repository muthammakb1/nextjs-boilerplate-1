/**
 * createRegistry — factory for building component registries.
 *
 * A registry maps AEM component `type` strings to:
 *   { Component, mapProps(data, extraProps) }
 *
 * Registries are plain objects but this factory adds:
 *   - Type-safe creation
 *   - .extend() for per-page overrides
 *   - .merge() for combining multiple registries
 *   - .get() with graceful miss handling
 *
 * @param {object} entries - { [aemType]: { Component, mapProps } }
 * @returns {Registry}
 *
 * @example
 *   const base = createRegistry({
 *     heroBanner: {
 *       Component: HeroBanner,
 *       mapProps: (data) => ({ title: data.title }),
 *     },
 *   });
 *
 *   // Per-page extension
 *   const pageRegistry = base.extend({
 *     specialWidget: { Component: Widget, mapProps: (d) => d },
 *   });
 */
export function createRegistry(entries = {}) {
  // Validate entries at creation time
  const validated = {};
  for (const [type, entry] of Object.entries(entries)) {
    if (!entry.Component) {
      console.warn(`[aem-renderer] Registry entry "${type}" has no Component — skipping.`);
      continue;
    }
    validated[type] = {
      Component: entry.Component,
      mapProps: typeof entry.mapProps === 'function' ? entry.mapProps : (data) => data,
    };
  }

  const registry = {
    /** Internal entries store */
    _entries: { ...validated },

    /**
     * Look up a component entry by AEM type.
     * @param {string} type
     * @returns {{ Component, mapProps } | null}
     */
    get(type) {
      return this._entries[type] || null;
    },

    /**
     * Check if a type is registered.
     * @param {string} type
     * @returns {boolean}
     */
    has(type) {
      return type in this._entries;
    },

    /**
     * List all registered type names.
     * @returns {string[]}
     */
    types() {
      return Object.keys(this._entries);
    },

    /**
     * Create a new registry that includes all current entries
     * plus additional/override entries. Does NOT mutate the original.
     *
     * @param {object} extraEntries
     * @returns {Registry}
     */
    extend(extraEntries = {}) {
      return createRegistry({ ...this._entries, ...extraEntries });
    },

    /**
     * Merge another registry into this one, returning a new registry.
     * The `other` registry's entries win on conflicts.
     *
     * @param {Registry} other
     * @returns {Registry}
     */
    merge(other) {
      return createRegistry({ ...this._entries, ...(other._entries || other) });
    },
  };

  return registry;
}
