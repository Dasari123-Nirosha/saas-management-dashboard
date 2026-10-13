
import { useEffect, useState } from "react";

function readValue(key, initialValue) {
  try {
    const storedValue = localStorage.getItem(key);

    if (storedValue !== null) {
      return JSON.parse(storedValue);
    }
  } catch (error) {
    console.error(`Unable to read "${key}" from localStorage:`, error);
  }

  return typeof initialValue === "function"
    ? initialValue()
    : initialValue;
}

export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() =>
    readValue(key, initialValue)
  );

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(
        `Unable to save "${key}" to localStorage:`,
        error
      );
    }
  }, [key, value]);

  const removeValue = () => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(
        `Unable to remove "${key}" from localStorage:`,
        error
      );
    }
  };

  return [value, setValue, removeValue];
}