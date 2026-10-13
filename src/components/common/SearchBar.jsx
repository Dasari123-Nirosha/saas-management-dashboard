
import { useState } from "react";
import { Search, X } from "lucide-react";

function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  onSearch,
  className = "",
  disabled = false,
  autoFocus = false,
}) {
  const [internalValue, setInternalValue] = useState("");

  const isControlled = value !== undefined;
  const searchValue = isControlled ? value : internalValue;

  const handleChange = (event) => {
    const nextValue = event.target.value;

    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onChange?.(nextValue);
  };

  const handleClear = () => {
    if (!isControlled) {
      setInternalValue("");
    }

    onChange?.("");
    onSearch?.("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch?.(searchValue.trim());
  };

  return (
    <form
      className={`search-bar ${className}`.trim()}
      onSubmit={handleSubmit}
      role="search"
    >
      <Search className="search-bar__icon" size={19} aria-hidden="true" />

      <input
        type="search"
        className="search-bar__input"
        placeholder={placeholder}
        value={searchValue}
        onChange={handleChange}
        disabled={disabled}
        autoFocus={autoFocus}
        aria-label={placeholder}
      />

      {searchValue && !disabled && (
        <button
          type="button"
          className="search-bar__clear"
          onClick={handleClear}
          aria-label="Clear search"
          title="Clear search"
        >
          <X size={17} />
        </button>
      )}

      <button
        type="submit"
        className="search-bar__submit"
        disabled={disabled}
      >
        Search
      </button>
    </form>
  );
}

export default SearchBar;