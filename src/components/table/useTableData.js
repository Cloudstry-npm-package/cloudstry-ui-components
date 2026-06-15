import { useMemo } from "react";

/* ── Search ─────────────────────────────────────────────────── */

function matchesSearch(row, query, columns, searchFn) {
    if (!query) return true;
    if (searchFn) return searchFn(row, query, columns);
    const q = query.toLowerCase();
    return columns.some((col) => {
        if (!col.key || col.key.startsWith("_")) return false;
        if (col.searchable === false) return false;
        const val = row[col.key];
        if (val === null || val === undefined) return false;
        return String(val).toLowerCase().includes(q);
    });
}

/* ── Filters ────────────────────────────────────────────────── */

function matchesFilters(row, filters, filterFn) {
    if (!filters || filters.length === 0) return true;
    if (filterFn) return filterFn(row, filters);
    return filters.every((f) => {
        const val = row[f.key];
        const fv = f.value;
        switch (f.operator) {
            case "eq":         return String(val ?? "") === String(fv ?? "");
            case "neq":        return String(val ?? "") !== String(fv ?? "");
            case "contains":   return String(val ?? "").toLowerCase().includes(String(fv ?? "").toLowerCase());
            case "startsWith": return String(val ?? "").toLowerCase().startsWith(String(fv ?? "").toLowerCase());
            case "gt":         return val > fv;
            case "gte":        return val >= fv;
            case "lt":         return val < fv;
            case "lte":        return val <= fv;
            default:           return true;
        }
    });
}

/* ── Sort ───────────────────────────────────────────────────── */

function compareValues(av, bv, col) {
    // Nulls always sink to the end regardless of sort direction
    if (av === null && bv === null) return 0;
    if (av === null) return 1;
    if (bv === null) return -1;

    if (col?.sortFn) return col.sortFn;

    const dataType =
        col?.dataType ||
        (typeof av === "number" && typeof bv === "number"
            ? "number"
            : typeof av === "string" &&
              typeof bv === "string" &&
              !isNaN(Date.parse(av)) &&
              !isNaN(Date.parse(bv))
            ? "date"
            : "string");

    if (dataType === "number") return av - bv;
    if (dataType === "date")   return new Date(av) - new Date(bv);
    return String(av).localeCompare(String(bv), undefined, {
        numeric: true,
        sensitivity: "base",
    });
}

/* ── Hook ───────────────────────────────────────────────────── */

export function useTableData({
    data,
    columns,
    searchQuery,
    filters,
    sortBy,
    page,
    pageSize,
    enablePagination,
    isServerSide,
    totalCount,
    searchFn,
    filterFn,
}) {
    return useMemo(() => {
        if (isServerSide) {
            return {
                processedData: data,
                totalFilteredCount: totalCount ?? data.length,
            };
        }

        // 1. Filters
        let rows = filters && filters.length > 0
            ? data.filter((row) => matchesFilters(row, filters, filterFn))
            : data;

        // 2. Search
        if (searchQuery) {
            rows = rows.filter((row) => matchesSearch(row, searchQuery, columns, searchFn));
        }

        // 3. Total count (before sort + slice; used for pagination UI)
        const totalFilteredCount = rows.length;

        // 4. Sort
        if (sortBy) {
            const { key, direction } = sortBy;
            const col = columns.find((c) => c.key === key);
            rows = [...rows].sort((a, b) => {
                const av = a[key] ?? null;
                const bv = b[key] ?? null;
                let cmp;
                if (av === null && bv === null) cmp = 0;
                else if (av === null) cmp = 1;
                else if (bv === null) cmp = -1;
                else if (col?.sortFn) cmp = col.sortFn(a, b);
                else cmp = compareValues(av, bv, col);
                return direction === "asc" ? cmp : -cmp;
            });
        }

        // 5. Pagination slice
        if (enablePagination && pageSize > 0) {
            const start = (page - 1) * pageSize;
            rows = rows.slice(start, start + pageSize);
        }

        return { processedData: rows, totalFilteredCount };
    }, [data, columns, searchQuery, filters, sortBy, page, pageSize, enablePagination, isServerSide, totalCount, searchFn, filterFn]);
}
