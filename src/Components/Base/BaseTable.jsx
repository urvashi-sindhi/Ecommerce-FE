import React from "react";

const BaseTable = ({ columns, data, actions }) => (
  <div className="table-responsive">
    <table className="table table-striped">
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              className={col.headerClassName}
              onClick={
                col.onHeaderClick ? () => col.onHeaderClick(col.key) : undefined
              }
            >
              {col.title}
              {col.sortable && col.sortIcon && col.sortIcon()}
            </th>
          ))}
          {actions && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((row, idx) => (
            <tr key={row.id || idx}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
              {actions && <td>{actions(row)}</td>}
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={columns.length + (actions ? 1 : 0)}
              className="text-center"
            >
              No data found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default BaseTable;
