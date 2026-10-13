
import { forwardRef, useId } from "react";
import { AlertCircle } from "lucide-react";

const Input = forwardRef(function Input(
  {
    label,
    name,
    type = "text",
    placeholder = "",
    value,
    defaultValue,
    onChange,
    error,
    hint,
    icon: Icon,
    required = false,
    disabled = false,
    className = "",
    ...props
  },
  ref
) {
  const generatedId = useId();
  const inputId = props.id || name || generatedId;

  return (
    <div className={`form-field ${className}`.trim()}>
      {label && (
        <label className="form-label" htmlFor={inputId}>
          {label}
          {required && <span className="required-mark"> *</span>}
        </label>
      )}

      <div
        className={`input-wrapper ${error ? "input-wrapper--error" : ""} ${
          disabled ? "input-wrapper--disabled" : ""
        }`}
      >
        {Icon && (
          <Icon className="input-icon" size={18} aria-hidden="true" />
        )}

        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          required={required}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          className="form-input"
          {...props}
        />
      </div>

      {error && (
        <p className="form-error" id={`${inputId}-error`} role="alert">
          <AlertCircle size={14} />
          {error}
        </p>
      )}

      {!error && hint && (
        <p className="form-hint" id={`${inputId}-hint`}>
          {hint}
        </p>
      )}
    </div>
  );
});

export default Input;