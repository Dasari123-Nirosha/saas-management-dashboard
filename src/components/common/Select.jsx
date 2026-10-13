
import { forwardRef, useId } from "react";
import { ChevronDown, AlertCircle } from "lucide-react";

const Select = forwardRef(function Select(
  {
    label,
    name,
    options = [],
    value,
    defaultValue,
    onChange,
    placeholder = "Select an option",
    error,
    hint,
    required = false,
    disabled = false,
    className = "",
    ...props
  },
  ref
) {
  const generatedId = useId();
  const selectId = props.id || name || generatedId;

  return (
    <div className={`form-field ${className}`.trim()}>
      {label && (
        <label className="form-label" htmlFor={selectId}>
          {label}
          {required && <span className="required-mark"> *</span>}
        </label>
      )}

      <div
        className={`select-wrapper ${error ? "select-wrapper--error" : ""}`}
      >
        <select
          ref={ref}
          id={selectId}
          name={name}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          required={required}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error
              ? `${selectId}-error`
              : hint
                ? `${selectId}-hint`
                : undefined
          }
          className="form-select"
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>

          {options.map((option) => {
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

        <ChevronDown
          className="select-arrow"
          size={18}
          aria-hidden="true"
        />
      </div>

      {error && (
        <p className="form-error" id={`${selectId}-error`} role="alert">
          <AlertCircle size={14} />
          {error}
        </p>
      )}

      {!error && hint && (
        <p className="form-hint" id={`${selectId}-hint`}>
          {hint}
        </p>
      )}
    </div>
  );
});

export default Select;