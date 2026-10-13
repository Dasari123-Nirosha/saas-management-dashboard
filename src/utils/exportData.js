
function escapeCSVValue(value) {
  if (value === null || value === undefined) {
    return "";
  }

  let text = value instanceof Date
    ? value.toISOString()
    : typeof value === "object"
      ? JSON.stringify(value)
      : String(value);

  // Escape values that could be interpreted as spreadsheet formulas.
  if (/^[\t\r ]*[=+\-@]/.test(text)) {
    text = `'${text}`;
  }

  return `"${text.replace(/"/g, '""')}"`;
}

export function exportToCSV(
  data,
  filename = "saas-dashboard-export.csv",
  columns
) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("No data available to export.");
  }

  const headers = columns?.length
    ? columns
    : [...new Set(data.flatMap((item) => Object.keys(item)))];

  const rows = [
    headers.map((header) => escapeCSVValue(header)).join(","),
    ...data.map((item) =>
      headers
        .map((header) => escapeCSVValue(item[header]))
        .join(",")
    ),
  ];

  const csvContent = `\uFEFF${rows.join("\r\n")}`;
  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename.endsWith(".csv")
    ? filename
    : `${filename}.csv`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

export function exportToJSON(
  data,
  filename = "saas-dashboard-export.json"
) {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], {
    type: "application/json;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename.endsWith(".json")
    ? filename
    : `${filename}.json`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

export function exportTableData(data, filename, columns) {
  return exportToCSV(data, filename, columns);
}