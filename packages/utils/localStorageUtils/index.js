// Save data to local storage
export const setLocalStorage = (key, value) => {
  if (!key || value === undefined) return;
  localStorage.setItem(key, JSON.stringify(value));
};

// Get data from local storage
export const getLocalStorage = (key) => {
  if (!key) return null;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

// Remove a specific key from local storage
export const removeLocalStorage = (key) => {
  if (!key) return;
  localStorage.removeItem(key);
};

// Clear all local storage data
export const clearLocalStorage = () => {
  localStorage.clear();
};
