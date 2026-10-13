
import { CalendarDays, RotateCcw } from "lucide-react";

function DateRangeFilter({
  startDate = "",
  endDate = "",
  onStartDateChange,
  onEndDateChange,
  onApply,
  onReset,
  minDate,
  maxDate,
  className = "",
}) {
  const invalidRange = startDate && endDate && startDate > endDate;

  const handleSubmit = (event) => {
    event.preventDefault();

    if (invalidRange) return;

    onApply?.({ startDate, endDate });
  };

  const handleReset = () => {
    onReset?.();
  };

  return (
    <form
      className={`date-range-filter ${className}`.trim()}
      onSubmit={handleSubmit}
    >
      <div className="date-range-filter__heading">
        <CalendarDays size={18} />
        <span>Date range</span>
      </div>

      <div className="date-range-filter__fields">
        <div className="date-range-filter__field">
          <label htmlFor="date-range-start">From</label>
          <input
            id="date-range-start"
            type="date"
            value={startDate}
            min={minDate}
            max={endDate || maxDate}
            onChange={(event) => onStartDateChange?.(event.target.value)}
          />
        </div>

        <div className="date-range-filter__field">
          <label htmlFor="date-range-end">To</label>
          <input
            id="date-range-end"
            type="date"
            value={endDate}
            min={startDate || minDate}
            max={maxDate}
            onChange={(event) => onEndDateChange?.(event.target.value)}
          />
        </div>
      </div>

      {invalidRange && (
        <p className="date-range-filter__error" role="alert">
          The end date must be on or after the start date.
        </p>
      )}

      <div className="date-range-filter__actions">
        <button
          type="submit"
          className="date-range-filter__apply"
          disabled={Boolean(invalidRange)}
        >
          Apply dates
        </button>

        <button
          type="button"
          className="date-range-filter__reset"
          onClick={handleReset}
        >
          <RotateCcw size={15} />
          Reset
        </button>
      </div>
    </form>
  );
}

export default DateRangeFilter;