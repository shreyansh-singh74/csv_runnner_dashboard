"use client";

interface RawTableProps {
  data: any[];
}

export default function RawTable({ data }: RawTableProps) {
  if (!data || data.length === 0) {
    return null;
  }

  const columns = Object.keys(data[0]);

  // Helper function to format cell values
  const formatCellValue = (value: any): string => {
    // If it's a Date object, format it
    if (value instanceof Date) {
      return value.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    }
    // If it's a number, format with 2 decimal places if needed
    if (typeof value === 'number') {
      // Check if it's a whole number or has decimals
      return value % 1 === 0 ? value.toString() : value.toFixed(2);
    }
    // For everything else, convert to string
    return String(value);
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-4 py-3 text-left text-sm font-semibold"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-t hover:bg-muted/50">
                {columns.map((column) => (
                  <td key={column} className="px-4 py-3 text-sm">
                    {formatCellValue(row[column])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}