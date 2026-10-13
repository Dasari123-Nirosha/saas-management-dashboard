
import { RotateCcw, SlidersHorizontal } from "lucide-react";

function FilterBar({
  filters = [],
  values = {},
  onChange,
  onReset,
  className = "",
}) {
  const hasActiveFilters = filters.some((filter) => {
    const value = values[filter.name];
    return value !== undefined && value !== "" && value !== "all";
  });

  const handleChange = (name, value) => {
    onChange?.({
      ...values,
      [name]: value,
    });
  };

  return (
    <div className={`filter-bar ${className}`.trim()}>
      <div className="filter-bar__heading">
        <SlidersHorizontal size={18} />
        <span>Filters</span>
      </div>

      <div className="filter-bar__controls">
        {filters.map((filter) => (
          <div className="filter-bar__field" key={filter.name}>
            {filter.label && (
              <label
                className="filter-bar__label"
                htmlFor={`filter-${filter.name}`}
              >
                {filter.label}
              </label>
            )}

            <select
              id={`filter-${filter.name}`}
              className="filter-bar__select"
              value={values[filter.name] ?? filter.defaultValue ?? "all"}
              onChange={(event) =>
                handleChange(filter.name, event.target.value)
              }
            >
              {(filter.options ?? []).map((option) => {
                const item =
                  typeof option === "string"
                    ? { label: option, value: option }
                    : option;

                return (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                );
              })}
            </select>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="filter-bar__reset"
        onClick={() => onReset?.()}
        disabled={!hasActiveFilters}
      >
        <RotateCcw size={15} />
        Reset filters
      </button>
    </div>
  );
}

export default FilterBar;