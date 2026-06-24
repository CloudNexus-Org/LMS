function escapeCsvValue(value) {
  const str = value == null ? "" : String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function rowsToCsvContent(rows) {
  return rows.map((row) => row.map(escapeCsvValue).join(",")).join("\r\n");
}

/**
 * Trigger a CSV file download in the browser.
 * @param {string} filename - Without or with .csv extension
 * @param {Array<Array<string|number|null|undefined>>} rows
 */
export function downloadCsv(filename, rows) {
  const safeName = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  const content = `\uFEFF${rowsToCsvContent(rows)}`;
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = safeName;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * @param {string} filename
 * @param {Array<{ header: string, key?: string, accessor?: (row: object) => unknown }>} columns
 * @param {Array<object>} data
 */
export function downloadCsvFromObjects(filename, columns, data) {
  const rows = [
    columns.map((col) => col.header),
    ...data.map((item) =>
      columns.map((col) => {
        if (typeof col.accessor === "function") return col.accessor(item);
        return item[col.key];
      })
    ),
  ];
  downloadCsv(filename, rows);
}

/**
 * @param {string} filename
 * @param {Array<{ title?: string, headers?: string[], rows: Array<Array<unknown>> }>} sections
 */
export function downloadMultiSectionCsv(filename, sections) {
  const rows = [];

  sections.forEach((section, index) => {
    if (index > 0) rows.push([]);
    if (section.title) rows.push([section.title]);
    if (section.headers?.length) rows.push(section.headers);
    rows.push(...section.rows);
  });

  downloadCsv(filename, rows);
}

export function csvFilename(prefix) {
  const date = new Date().toISOString().slice(0, 10);
  return `cloud-nexus-${prefix}-${date}`;
}
