"use client";
import React, { useState, useMemo } from "react";
import TableBase from "./table.base.jsx";
import { useTableData } from "./useTableData.js";

/* ── Search icons ─────────────────────────────────────────── */

function SearchIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
        </svg>
    );
}

function ClearIcon() {
    return (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.8" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" />
        </svg>
    );
}

/* ── Search input ─────────────────────────────────────────── */

function TableSearchInput({ value, onChange, placeholder }) {
    return (
        <div className="cst-table-search">
            <div className="cst-table-search-inner">
                <span className="cst-table-search-icon">
                    <SearchIcon />
                </span>
                <input
                    type="search"
                    className="cst-table-search-input"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder || "Search…"}
                    aria-label="Search table"
                />
                {value && (
                    <button
                        type="button"
                        className="cst-table-search-clear"
                        onClick={() => onChange("")}
                        aria-label="Clear search"
                    >
                        <ClearIcon />
                    </button>
                )}
            </div>
        </div>
    );
}

/* ── Pagination helpers ───────────────────────────────────── */

function getPageNumbers(current, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
    if (current >= total - 3) return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
    return [1, "...", current - 1, current, current + 1, "...", total];
}

function TablePagination({
    page,
    totalPages,
    pageSize,
    pageSizeOptions,
    totalFiltered,
    onPageChange,
    onPageSizeChange,
}) {
    if (totalFiltered === 0) return null;

    const startIndex = (page - 1) * pageSize;
    const endIndex   = Math.min(startIndex + pageSize, totalFiltered);
    const showSize   = pageSizeOptions && pageSizeOptions.length > 1;
    const pageNums   = getPageNumbers(page, totalPages);

    return (
        <div className="cst-table-pagination">
            <div className="cst-pagination-info">
                {`Showing ${startIndex + 1}–${endIndex} of ${totalFiltered}`}
            </div>

            <nav
                className="cst-pagination-controls"
                role="navigation"
                aria-label="Table pagination"
            >
                <button
                    type="button"
                    className="cst-pagination-btn cst-pagination-prev"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    aria-label="Previous page"
                >
                    &#8249;
                </button>

                {pageNums.map((n, i) =>
                    n === "..." ? (
                        <span
                            key={`ell-${i}`}
                            className="cst-pagination-ellipsis"
                            aria-hidden="true"
                        >
                            &hellip;
                        </span>
                    ) : (
                        <button
                            key={n}
                            type="button"
                            className={[
                                "cst-pagination-btn",
                                "cst-pagination-page",
                                n === page ? "cst-pagination-page-active" : "",
                            ].filter(Boolean).join(" ")}
                            onClick={() => onPageChange(n)}
                            aria-label={`Go to page ${n}`}
                            aria-current={n === page ? "page" : undefined}
                        >
                            {n}
                        </button>
                    )
                )}

                <button
                    type="button"
                    className="cst-pagination-btn cst-pagination-next"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                    aria-label="Next page"
                >
                    &#8250;
                </button>
            </nav>

            {showSize && (
                <label className="cst-pagination-size-label">
                    Rows per page
                    <select
                        className="cst-pagination-size"
                        value={pageSize}
                        onChange={(e) => onPageSizeChange(Number(e.target.value))}
                        aria-label="Rows per page"
                    >
                        {pageSizeOptions.map((n) => (
                            <option key={n} value={n}>{n}</option>
                        ))}
                    </select>
                </label>
            )}
        </div>
    );
}

/* ── Table ────────────────────────────────────────────────── */

export default function Table({
    /* ── Data ── */
    data = [],
    columns = [],

    /* ── Phase 1 passthrough ── */
    title,
    rowKey,
    loading = false,
    emptyMessage,
    emptyNode,
    onRowClick,
    density,
    stickyHeader,
    zebra,
    ariaLabel,
    ariaLabelledby,
    className,
    titleClassName,
    tableClassName,
    headerClassName,
    bodyClassName,
    rowClassName,
    emptyClassName,

    /* ── Phase 2 passthrough ── */
    toolbarClassName,
    toolbar,
    bulkActions,
    selectedKeys,
    onSelectionChange,
    selectionMode,

    /* ── Phase 1/2: sort (controlled, unchanged from v1) ── */
    sortBy: sortByProp,
    onSortChange,

    /* ── Phase 3A: feature flags ── */
    searchable = false,
    sortable   = false,
    pagination = false,
    pageSize: pageSizeProp = 10,
    pageSizeOptions = [10, 25, 50, 100],
    searchPlaceholder,

    /* ── Phase 3A: controlled overrides ── */
    searchQuery:  searchQueryProp,
    onSearchChange,
    currentPage:  currentPageProp,
    onPageChange,
    onPageSizeChange,

    /* ── Phase 3A: filters ── */
    filters:       filtersProp,
    onFiltersChange,

    /* ── Phase 3A: server-side ── */
    totalCount,

    /* ── Phase 3A: custom processing ── */
    searchFn,
    filterFn,

    /* ── V3: row expansion (issue #8) ── */
    renderExpandedRow,
    expandable,
    expandedKeys: expandedKeysProp,
    onExpandedChange,
    expandRowLabel,
}) {
    /* ── Control detection ── */
    const isServerSide       = totalCount !== undefined;
    const isSearchControlled = searchQueryProp !== undefined;
    const isPageControlled   = currentPageProp !== undefined;
    const isFiltersControlled = filtersProp !== undefined;
    // Expansion follows the same controlled/uncontrolled split as sort: pass
    // expandedKeys to own it, omit it and the Table tracks its own open rows.
    const isExpandedControlled = expandedKeysProp !== undefined;
    // Sort is controlled when sortByProp is provided explicitly (v1 pattern or v2 controlled mode).
    // When sortable=true but sortByProp is absent, Table manages sort state internally.
    const isSortControlled   = sortByProp !== undefined;

    /* ── Internal state ── */
    const [internalSearch,   setInternalSearch]   = useState("");
    const [internalSortBy,   setInternalSortBy]   = useState(null);
    const [internalPage,     setInternalPage]     = useState(1);
    const [internalPageSize, setInternalPageSize] = useState(pageSizeProp);
    const [internalFilters,  setInternalFilters]  = useState([]);
    const [internalExpanded, setInternalExpanded] = useState(() => new Set());

    /* ── Effective values ── */
    const effectiveSearch   = isSearchControlled  ? searchQueryProp : internalSearch;
    const effectiveFilters  = isFiltersControlled ? filtersProp     : internalFilters;
    const effectivePage     = isPageControlled    ? currentPageProp : internalPage;
    const effectivePageSize = internalPageSize;
    // When sortByProp is provided use it; otherwise use internalSortBy (null when sortable=false, state when sortable=true)
    const effectiveSortBy   = isSortControlled ? sortByProp : internalSortBy;
    const effectiveExpanded = isExpandedControlled ? expandedKeysProp : internalExpanded;

    /* ── Effective columns: apply component-level sortable default ── */
    const effectiveColumns = useMemo(() => {
        if (!sortable) return columns;
        return columns.map((col) =>
            col.sortable !== undefined
                ? col
                : { ...col, sortable: !!(col.key && !col.key.startsWith("_")) }
        );
    }, [columns, sortable]);

    /* ── Data processing ── */
    const { processedData, totalFilteredCount } = useTableData({
        data,
        columns: effectiveColumns,
        searchQuery: (searchable || isSearchControlled) ? effectiveSearch : "",
        filters:     effectiveFilters,
        sortBy:      effectiveSortBy,
        page:        effectivePage,
        pageSize:    effectivePageSize,
        enablePagination: pagination,
        isServerSide,
        totalCount,
        searchFn,
        filterFn,
    });

    /* ── Page reset helper ── */
    const resetPage = () => {
        if (!pagination) return;
        if (isPageControlled) onPageChange?.(1);
        else setInternalPage(1);
    };

    /* ── Handlers ── */
    const handleSearchChange = (q) => {
        if (isSearchControlled) onSearchChange?.(q);
        else setInternalSearch(q);
        resetPage();
    };

    const handleFiltersChange = (f) => {
        if (isFiltersControlled) onFiltersChange?.(f);
        else setInternalFilters(f);
        resetPage();
    };

    const handleSortChange = (sort) => {
        if (isSortControlled) onSortChange?.(sort);
        else setInternalSortBy(sort);
    };

    const handleExpandedChange = (keys) => {
        if (isExpandedControlled) onExpandedChange?.(keys);
        else {
            setInternalExpanded(keys);
            onExpandedChange?.(keys);
        }
    };

    const handlePageChange = (p) => {
        if (isPageControlled) onPageChange?.(p);
        else setInternalPage(p);
    };

    const handlePageSizeChange = (ps) => {
        setInternalPageSize(ps);
        onPageSizeChange?.(ps);
        if (isPageControlled) onPageChange?.(1);
        else setInternalPage(1);
    };

    /* ── Search node (rendered above toolbar via TableBase's searchNode slot) ── */
    const searchNode = searchable ? (
        <TableSearchInput
            value={effectiveSearch}
            onChange={handleSearchChange}
            placeholder={searchPlaceholder}
        />
    ) : null;

    /* ── Pagination node (rendered below table via TableBase's paginationNode slot) ── */
    const totalPages = pagination && totalFilteredCount > 0
        ? Math.ceil(totalFilteredCount / effectivePageSize)
        : 0;

    const paginationNode = pagination ? (
        <TablePagination
            page={effectivePage}
            totalPages={totalPages}
            pageSize={effectivePageSize}
            pageSizeOptions={pageSizeOptions}
            totalFiltered={totalFilteredCount}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
        />
    ) : null;

    /* ── Context-aware empty message ── */
    const resolvedEmptyMessage =
        emptyMessage !== undefined
            ? emptyMessage
            : (searchable || isSearchControlled) && effectiveSearch
                ? "No results match your search"
                : undefined;

    return (
        <TableBase
            data={processedData}
            columns={effectiveColumns}
            title={title}
            rowKey={rowKey}
            loading={loading}
            emptyMessage={resolvedEmptyMessage}
            emptyNode={emptyNode}
            onRowClick={onRowClick}
            density={density}
            stickyHeader={stickyHeader}
            zebra={zebra}
            ariaLabel={ariaLabel}
            ariaLabelledby={ariaLabelledby}
            className={className}
            titleClassName={titleClassName}
            tableClassName={tableClassName}
            headerClassName={headerClassName}
            bodyClassName={bodyClassName}
            rowClassName={rowClassName}
            emptyClassName={emptyClassName}
            toolbarClassName={toolbarClassName}
            toolbar={toolbar}
            bulkActions={bulkActions}
            selectedKeys={selectedKeys}
            onSelectionChange={onSelectionChange}
            selectionMode={selectionMode}
            sortBy={effectiveSortBy}
            onSortChange={handleSortChange}
            renderExpandedRow={renderExpandedRow}
            expandable={expandable}
            expandedKeys={effectiveExpanded}
            onExpandedChange={handleExpandedChange}
            expandRowLabel={expandRowLabel}
            searchNode={searchNode}
            paginationNode={paginationNode}
        />
    );
}
