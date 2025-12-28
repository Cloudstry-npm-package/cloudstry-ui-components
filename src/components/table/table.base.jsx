import React from "react";
import "./table.css";

function TableBase({
    title = "Table Title",
    columns = [
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        { key: "email", label: "Email" }
    ],
    data = [],
    className = "",
    titleClassName = "",
    tableClassName = "",
}) {
    return (
        <div className={`cst-table-wrapper ${className}`}>

            {/* TITLE */}
            {title && (
                <h2 className={`cst-table-title ${titleClassName}`}>
                    {title}
                </h2>
            )}

            <div className="cst-table-container">
                <table className={`cst-table ${tableClassName}`}>
                    <thead>
                        <tr>
                            {columns.map((col, idx) => (
                                <th
                                    key={idx}
                                    style={{
                                        width: col.width || "auto"
                                    }}
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="cst-table-empty">
                                    No records found
                                </td>
                            </tr>
                        ) : (
                            data.map((row, i) => (
                                <tr key={i}>
                                    {columns.map((col, idx) => (
                                        <td key={idx}>
                                            {row[col.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TableBase;
