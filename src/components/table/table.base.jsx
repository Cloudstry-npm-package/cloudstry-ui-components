import React from "react";
import "./table.css";

/* ── Internal sort-indicator icons ──────────────────────── */

function SortAscIcon() {
    return (
        <svg width="9" height="8" viewBox="0 0 9 8" aria-hidden="true" fill="currentColor">
            <path d="M4.5 0L9 8H0L4.5 0Z" />
        </svg>
    );
}

function SortDescIcon() {
    return (
        <svg width="9" height="8" viewBox="0 0 9 8" aria-hidden="true" fill="currentColor">
            <path d="M4.5 8L0 0H9L4.5 8Z" />
        </svg>
    );
}

function SortNeutralIcon() {
    return (
        <svg width="9" height="13" viewBox="0 0 9 13" aria-hidden="true" fill="currentColor">
            <path d="M4.5 0L9 5H0L4.5 0Z" opacity="0.45" />
            <path d="M4.5 13L0 8H9L4.5 13Z" opacity="0.45" />
        </svg>
    );
}

/* ── TableBase ───────────────────────────────────────────── */

function TableBase({
    /* ---- Phase 1 props (unchanged) ---- */
    title,
    columns = [],
    data = [],
    rowKey,
    loading = false,
    emptyMessage = "No records found",
    emptyNode,
    onRowClick,
    density = "comfortable",
    stickyHeader = false,
    zebra = false,
    ariaLabel,
    ariaLabelledby,
    className = "",
    titleClassName = "",
    tableClassName = "",
    headerClassName = "",
    bodyClassName = "",
    rowClassName = "",
    emptyClassName = "",

    /* ---- Phase 2: Sorting ---- */
    sortBy,           // { key: string, direction: "asc" | "desc" } | null
    onSortChange,     // (sort) => void

    /* ---- Phase 2: Selection ---- */
    selectedKeys,         // Set<string>
    onSelectionChange,    // (keys: Set<string>) => void
    selectionMode = "none", // "none" | "single" | "multi"

    /* ---- Phase 2: Toolbar ---- */
    toolbar,              // ReactNode — always visible slot above table
    bulkActions,          // ReactNode — replaces toolbar when rows are selected
    toolbarClassName = "",

    /* ---- Phase 3A: internal render slots (injected by Table, not for consumers) ---- */
    searchNode,     // renders between title and toolbar
    paginationNode, // renders after table container
}) {
    const titleId = React.useId();
    const selectAllRef = React.useRef(null);

    /* ---- Dev warning: selection without rowKey ---- */
    React.useEffect(() => {
        if (selectionMode !== "none" && !rowKey) {
            console.warn(
                "[cst-table] `selectionMode` is set but `rowKey` is missing. " +
                "Row identity falls back to array index — this breaks when data is sorted or filtered. " +
                "Provide a `rowKey` prop for stable row identity."
            );
        }
    }, [selectionMode, rowKey]);

    /* ---- Indeterminate header checkbox ---- */
    const isAllSelected = selectionMode === "multi" && data.length > 0 && selectedKeys && selectedKeys.size >= data.length;
    const isIndeterminate = selectionMode === "multi" && selectedKeys && selectedKeys.size > 0 && selectedKeys.size < data.length;

    React.useEffect(() => {
        if (selectAllRef.current) {
            selectAllRef.current.indeterminate = !!isIndeterminate;
        }
    }, [isIndeterminate]);

    /* ---- Computed flags ---- */
    const hasSelection = selectionMode !== "none";
    const showBulkBar = !!(bulkActions && selectedKeys && selectedKeys.size > 0);
    const hasToolbar = !!(toolbar || showBulkBar);
    const effectiveColumnCount = columns.length + (hasSelection ? 1 : 0);

    /* ---- aria ---- */
    const resolvedAriaLabel = ariaLabel || undefined;
    const resolvedAriaLabelledby = !ariaLabel
        ? (ariaLabelledby || (title ? titleId : undefined))
        : undefined;

    /* ---- CSS classes ---- */
    const wrapperClasses = [
        "cst-table-wrapper",
        `cst-density-${density}`,
        stickyHeader ? "cst-sticky-header" : "",
        zebra ? "cst-zebra" : "",
        className,
    ].filter(Boolean).join(" ");

    /* ── Helpers ─────────────────────────────────────────── */

    const getRowKey = (row, index) => {
        if (rowKey && row[rowKey] !== undefined && row[rowKey] !== null) {
            return String(row[rowKey]);
        }
        return index;
    };

    const getBaseRowClass = (row, index) => {
        const base = typeof rowClassName === "function" ? rowClassName(row, index) : (rowClassName || "");
        const clickable = onRowClick ? "cst-row-clickable" : "";
        return [base, clickable].filter(Boolean).join(" ");
    };

    const renderCell = (col, row, rowIndex) => {
        if (col.render) return col.render(row, rowIndex);
        const value = row[col.key];
        return value !== undefined && value !== null ? value : "";
    };

    const renderHeaderCell = (col) => {
        if (col.headerRender) return col.headerRender();
        return col.label;
    };

    const getColWidth = (w) => {
        if (!w) return undefined;
        return typeof w === "number" ? `${w}px` : w;
    };

    const isRowSelected = (row, rowIndex) => {
        if (!selectedKeys || selectionMode === "none") return false;
        return selectedKeys.has(String(getRowKey(row, rowIndex)));
    };

    /* ── Sort helpers ────────────────────────────────────── */

    const getSortAriaSort = (col) => {
        if (!col.sortable) return undefined;
        if (!sortBy || sortBy.key !== col.key) return "none";
        return sortBy.direction === "asc" ? "ascending" : "descending";
    };

    const getSortIcon = (col) => {
        if (!sortBy || sortBy.key !== col.key) return <SortNeutralIcon />;
        return sortBy.direction === "asc" ? <SortAscIcon /> : <SortDescIcon />;
    };

    const handleSortClick = (col) => {
        if (!onSortChange) return;
        if (!sortBy || sortBy.key !== col.key) {
            onSortChange({ key: col.key, direction: "asc" });
        } else if (sortBy.direction === "asc") {
            onSortChange({ key: col.key, direction: "desc" });
        } else {
            onSortChange(null);
        }
    };

    /* ── Selection handlers ──────────────────────────────── */

    const handleRowCheckbox = (row, rowIndex) => {
        if (!onSelectionChange || !selectedKeys) return;
        const key = String(getRowKey(row, rowIndex));
        if (selectionMode === "single") {
            onSelectionChange(selectedKeys.has(key) ? new Set() : new Set([key]));
        } else {
            const next = new Set(selectedKeys);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            onSelectionChange(next);
        }
    };

    const handleSelectAll = () => {
        if (!onSelectionChange || !selectedKeys) return;
        if (isAllSelected || isIndeterminate) {
            onSelectionChange(new Set());
        } else {
            const allKeys = data.map((row, i) => String(getRowKey(row, i)));
            onSelectionChange(new Set(allKeys));
        }
    };

    /* ── Render ──────────────────────────────────────────── */

    return (
        <div className={wrapperClasses}>
            {/* Title */}
            {title && (
                <h2 id={titleId} className={`cst-table-title ${titleClassName}`}>
                    {title}
                </h2>
            )}

            {/* Search — between title and toolbar (injected by Table in Phase 3A) */}
            {searchNode}

            {/* Toolbar — between search and table */}
            {hasToolbar && (
                <div className={`cst-table-toolbar ${toolbarClassName}`.trim()}>
                    {showBulkBar ? (
                        <div className="cst-toolbar-selection-bar">
                            <span className="cst-toolbar-selection-count">
                                {selectedKeys.size} {selectedKeys.size === 1 ? "row" : "rows"} selected
                            </span>
                            <div className="cst-toolbar-bulk-actions">
                                {bulkActions}
                            </div>
                        </div>
                    ) : (
                        <div className="cst-toolbar-content">
                            {toolbar}
                        </div>
                    )}
                </div>
            )}

            {/* Table container */}
            <div className="cst-table-container">
                <table
                    className={`cst-table ${tableClassName}`}
                    aria-label={resolvedAriaLabel}
                    aria-labelledby={resolvedAriaLabelledby}
                    aria-busy={loading || undefined}
                >
                    <thead className={`cst-table-head ${headerClassName}`}>
                        <tr>
                            {/* Checkbox header */}
                            {hasSelection && (
                                <th scope="col" className="cst-table-checkbox-col cst-th-checkbox">
                                    {selectionMode === "multi" && (
                                        <input
                                            ref={selectAllRef}
                                            type="checkbox"
                                            checked={!!isAllSelected}
                                            onChange={handleSelectAll}
                                            aria-label="Select all rows"
                                        />
                                    )}
                                </th>
                            )}

                            {/* Data column headers */}
                            {columns.map((col, idx) => (
                                <th
                                    key={col.key || idx}
                                    scope="col"
                                    style={col.width ? { width: getColWidth(col.width) } : undefined}
                                    className={[
                                        col.align ? `cst-align-${col.align}` : "",
                                        col.sortable ? "cst-th-sortable" : "",
                                    ].filter(Boolean).join(" ") || undefined}
                                    aria-sort={getSortAriaSort(col)}
                                >
                                    {col.sortable ? (
                                        <button
                                            type="button"
                                            className="cst-table-sort-btn"
                                            onClick={() => handleSortClick(col)}
                                            aria-label={`Sort by ${col.label}`}
                                        >
                                            <span className="cst-sort-label">{renderHeaderCell(col)}</span>
                                            <span className="cst-sort-icon" aria-hidden="true">
                                                {getSortIcon(col)}
                                            </span>
                                        </button>
                                    ) : (
                                        renderHeaderCell(col)
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className={`cst-table-body ${bodyClassName}`}>
                        {loading ? (
                            <tr>
                                <td colSpan={effectiveColumnCount} className="cst-table-loading">
                                    <div className="cst-table-loading-inner">
                                        <span
                                            className="cst-table-spinner"
                                            role="status"
                                            aria-label="Loading data"
                                        />
                                        <span className="cst-table-loading-text" aria-hidden="true">
                                            Loading...
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={effectiveColumnCount}
                                    className={`cst-table-empty ${emptyClassName}`}
                                >
                                    {emptyNode || emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            data.map((row, rowIndex) => {
                                const rowKeyVal = getRowKey(row, rowIndex);
                                const selected = isRowSelected(row, rowIndex);
                                const rowCls = [
                                    getBaseRowClass(row, rowIndex),
                                    selected ? "cst-table-row-selected" : "",
                                ].filter(Boolean).join(" ");

                                return (
                                    <tr
                                        key={rowKeyVal}
                                        className={rowCls || undefined}
                                        aria-selected={hasSelection ? selected : undefined}
                                        onClick={onRowClick ? () => onRowClick(row) : undefined}
                                        tabIndex={onRowClick ? 0 : undefined}
                                        onKeyDown={onRowClick ? (e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                e.preventDefault();
                                                onRowClick(row);
                                            }
                                        } : undefined}
                                    >
                                        {/* Checkbox cell — stops click propagation to avoid triggering onRowClick */}
                                        {hasSelection && (
                                            <td
                                                className="cst-table-checkbox-col"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selected}
                                                    onChange={() => handleRowCheckbox(row, rowIndex)}
                                                    aria-label={`Select row ${rowKeyVal}`}
                                                />
                                            </td>
                                        )}

                                        {/* Data cells */}
                                        {columns.map((col, idx) => (
                                            <td
                                                key={col.key || idx}
                                                className={col.align ? `cst-align-${col.align}` : undefined}
                                            >
                                                {renderCell(col, row, rowIndex)}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination — after table container (injected by Table in Phase 3A) */}
            {paginationNode}
        </div>
    );
}

export default TableBase;
