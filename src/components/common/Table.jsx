
function Table({
  columns = [],
  data = [],
  rowKey = "id",
  onRowClick,
  emptyMessage = "No records found.",
  className = "",
}) {
  return (
    <div className={`table-container ${className}`.trim()}>
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={column.headerClassName || ""}
                style={column.width ? { width: column.width } : undefined}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <tr
                key={row[rowKey] ?? index}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={onRowClick ? "data-table__row--clickable" : ""}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={column.cellClassName || ""}
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key] ?? "—"}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={Math.max(columns.length, 1)}
                className="data-table__empty"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;