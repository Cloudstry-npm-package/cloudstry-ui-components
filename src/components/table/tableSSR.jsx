import TableBase from "./table.base.jsx";

// Strips all interaction and stateful props before delegating to TableBase.
// Interaction props (onRowClick, sort, selection, bulkActions) produce dead HTML
// in a React Server Component where event handlers are never hydrated.
// Phase 3A stateful props (searchable, pagination, etc.) are client-only features.
export function TableSSR({ columns = [], ...rest }) {
    const {
        // Interaction props
        onRowClick,
        sortBy, onSortChange,
        selectedKeys, onSelectionChange, selectionMode,
        bulkActions,
        // Phase 3A stateful props (not meaningful without "use client")
        searchable, sortable, pagination,
        pageSize, pageSizeOptions, searchPlaceholder,
        searchQuery, onSearchChange,
        currentPage, onPageChange, onPageSizeChange,
        filters, onFiltersChange,
        totalCount,
        searchFn, filterFn,
        // V3 row expansion — the disclosure button is inert without hydration,
        // so it is stripped rather than rendered dead (same rule as onRowClick).
        renderExpandedRow, expandable, expandedKeys, onExpandedChange, expandRowLabel,
        ...safeRest
    } = rest;

    // Strip col.sortable and col.sortFn to prevent dead sort buttons in static output
    const safeColumns = columns.map(({ sortable: _s, sortFn: _sf, ...col }) => col);

    return <TableBase columns={safeColumns} {...safeRest} />;
}
