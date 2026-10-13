
const STORAGE_PREFIX = "saas-dashboard-";

export function getStorageKey(key) {
  return `${STORAGE_PREFIX}${key}`;
}

export function getStorageItem(key, fallback = null) {
  try {
    const value = localStorage.getItem(getStorageKey(key));

    if (value === null) {
      return fallback;
    }

    return JSON.parse(value);
  } catch (error) {
    console.error(`Failed to read storage key "${key}":`, error);
    return fallback;
  }
}

export function setStorageItem(key, value) {
  try {
    localStorage.setItem(
      getStorageKey(key),
      JSON.stringify(value)
    );

    return true;
  } catch (error) {
    console.error(`Failed to save storage key "${key}":`, error);
    return false;
  }
}

export function removeStorageItem(key) {
  try {
    localStorage.removeItem(getStorageKey(key));
    return true;
  } catch (error) {
    console.error(`Failed to remove storage key "${key}":`, error);
    return false;
  }
}

export function clearDashboardStorage() {
  try {
    const keysToRemove = [];

    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);

      if (key?.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key));

    return true;
  } catch (error) {
    console.error("Failed to clear dashboard storage:", error);
    return false;
  }
}

export function hasStorageItem(key) {
  try {
    return localStorage.getItem(getStorageKey(key)) !== null;
  } catch (error) {
    console.error(`Failed to check storage key "${key}":`, error);
    return false;
  }
}