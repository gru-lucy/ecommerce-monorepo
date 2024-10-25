import React from 'react';

type Column = {
  key: string;
  header: string;
};

type TableProps = {
  columns: Column[];
  data: Record<string, any>[];
};

const Table: React.FC<TableProps> = ({ columns, data }) => {
  return (
    <div className="flex flex-col">
      <div className="-m-1.5 overflow-x-auto">
        <div className="p-1.5 min-w-full inline-block align-middle">
          <div className="border rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      scope="col"
                      className="px-6 py-4 text-xs text-center font-medium text-gray-500 uppercase"
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.length ? (
                  data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className="px-6 py-3 whitespace-nowrap text-center text-sm text-gray-800"
                        >
                          {row[column.key]}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-red-500 px-6 py-3 text-center"
                    >
                      No data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
