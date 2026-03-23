"use client";
import { useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    flexRender,
    createColumnHelper,
    SortingState,
} from "@tanstack/react-table";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { SalesAnalysisData } from "@/app/utils/types";

// Update this interface to match your Laravel API JSON response


export default function SalesTable({ data }: { data: SalesAnalysisData[] }) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState("");

    const columnHelper = createColumnHelper<SalesAnalysisData>();

    // Helper function for Indian Currency format
    const formatINR = (val: number) => `₹${Number(val).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

    const columns = [
        columnHelper.accessor("period", {
            header: "Period",
            cell: (info) => <span className="fw-bold">{info.getValue()}</span>,
            footer: () => "Total / Avg",
        }),
        columnHelper.accessor("gross_sales", {
            header: "Gross Sale",
            cell: (info) => formatINR(info.getValue()),
            footer: (info) => formatINR(info.table.getFilteredRowModel().rows.reduce((sum, row) => sum + row.original.gross_sales, 0)),
        }),
        columnHelper.accessor("total_sales", {
            header: "Total Sale",
            cell: (info) => <span className="text-success fw-medium">{formatINR(info.getValue())}</span>,
            footer: (info) => {
                const total = info.table.getFilteredRowModel().rows.reduce((sum, row) => sum + row.original.total_sales, 0);
                return <span className="text-success">{formatINR(total)}</span>;
            },
        }),
        columnHelper.accessor("orders", {
            header: "Orders",
            cell: (info) => info.getValue().toLocaleString(),
            footer: (info) => info.table.getFilteredRowModel().rows.reduce((sum, row) => sum + row.original.orders, 0).toLocaleString(),
        }),
        columnHelper.accessor("returns", {
            header: "Returns",
            cell: (info) => <span className="text-danger">{formatINR(info.getValue())}</span>,
            footer: (info) => formatINR(info.table.getFilteredRowModel().rows.reduce((sum, row) => sum + row.original.returns, 0)),
        }),
        columnHelper.accessor("fb_spend", {
            header: "FB Spend",
            cell: (info) => formatINR(info.getValue()),
            footer: (info) => formatINR(info.table.getFilteredRowModel().rows.reduce((sum, row) => sum + row.original.fb_spend, 0)),
        }),
        columnHelper.accessor("google_spend", {
            header: "Google Spend",
            cell: (info) => formatINR(info.getValue()),
            footer: (info) => formatINR(info.table.getFilteredRowModel().rows.reduce((sum, row) => sum + row.original.google_spend, 0)),
        }),
        columnHelper.accessor("total_spend", {
            header: "Total Spend",
            cell: (info) => <span className="text-warning fw-medium">{formatINR(info.getValue())}</span>,
            footer: (info) => {
                const total = info.table.getFilteredRowModel().rows.reduce((sum, row) => sum + row.original.total_spend, 0);
                return <span className="text-warning">{formatINR(total)}</span>;
            },
        }),
        columnHelper.accessor("fb_roas", {
            header: "FB ROAS",
            cell: (info) => `${info.getValue().toFixed(2)}x`,
            footer: () => "-", // Requires FB specific sales to calculate true average
        }),
        columnHelper.accessor("google_roas", {
            header: "Google ROAS",
            cell: (info) => `${info.getValue().toFixed(2)}x`,
            footer: () => "-", // Requires Google specific sales
        }),
        columnHelper.accessor("blended_roas", {
            header: "Blended ROAS",
            cell: (info) => <span className="fw-bold">{info.getValue().toFixed(2)}x</span>,
            footer: (info) => {
                // True Blended ROAS = Total Sales / Total Spend across all rows
                const rows = info.table.getFilteredRowModel().rows;
                const totalSales = rows.reduce((sum, row) => sum + row.original.total_sales, 0);
                const totalSpend = rows.reduce((sum, row) => sum + row.original.total_spend, 0);
                const blended = totalSpend > 0 ? (totalSales / totalSpend) : 0;
                return <span className="fw-bold">{blended.toFixed(2)}x</span>;
            },
        }),
        columnHelper.accessor("returning_customer_percent", {
            header: "Returning %",
            cell: (info) => `${info.getValue().toFixed(1)}%`,
            footer: (info) => {
                // Simple average for the footer
                const rows = info.table.getFilteredRowModel().rows;
                if (rows.length === 0) return "0%";
                const avg = rows.reduce((sum, row) => sum + row.original.returning_customer_percent, 0) / rows.length;
                return `${avg.toFixed(1)}%`;
            },
        }),
        columnHelper.accessor("new_customers", {
            header: "New Customers",
            cell: (info) => info.getValue().toLocaleString(),
            footer: (info) => info.table.getFilteredRowModel().rows.reduce((sum, row) => sum + row.original.new_customers, 0).toLocaleString(),
        }),
        columnHelper.accessor("cac", {
            header: "CAC",
            cell: (info) => formatINR(info.getValue()),
            footer: (info) => {
                // True CAC = Total Spend / Total New Customers
                const rows = info.table.getFilteredRowModel().rows;
                const totalSpend = rows.reduce((sum, row) => sum + row.original.total_spend, 0);
                const totalNew = rows.reduce((sum, row) => sum + row.original.new_customers, 0);
                const cac = totalNew > 0 ? (totalSpend / totalNew) : 0;
                return formatINR(cac);
            },
        }),
    ];

    const table = useReactTable({
        data,
        columns,
        state: { sorting, globalFilter },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    return (
        <div className="card shadow-sm border-0 mt-4">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                <div className="filter-options d-flex gap-2 align-items-center">
                    <span className="text-muted small">Show</span>
                    <select
                        className="form-select form-select-sm w-auto"
                        value={table.getState().pagination.pageSize}
                        onChange={e => table.setPageSize(Number(e.target.value))}
                    >
                        {[10, 20, 30, 40, 50].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
                
                <input
                    type="text"
                    className="form-control w-25"
                    placeholder="Search metrics..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                />
            </div>

            <div className="table-responsive" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                <table className="table table-hover table-striped table-nowrap align-middle mb-0 text-center" style={{ minWidth: '1200px' }}>
                    <thead className="table-light sticky-top" style={{ zIndex: 1 }}>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th 
                                        key={header.id} 
                                        onClick={header.column.getToggleSortingHandler()} 
                                        style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                                    >
                                        <div className="d-flex align-items-center justify-content-center gap-1 px-2">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {{
                                                asc: <FaSortUp />,
                                                desc: <FaSortDown />,
                                            }[header.column.getIsSorted() as string] ?? <FaSort className="opacity-25" />}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className="px-3">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="table-light fw-bold sticky-bottom">
                        {table.getFooterGroups().map(footerGroup => (
                            <tr key={footerGroup.id}>
                                {footerGroup.headers.map(header => (
                                    <td key={header.id} className="px-3 py-3 border-top">
                                        {flexRender(header.column.columnDef.footer, header.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tfoot>
                </table>
            </div>
            <div className="card-footer bg-white d-flex justify-content-between align-items-center py-3">
                <span className="text-muted small">
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
                </span>
                <div>
                    <button 
                        className="btn btn-sm btn-outline-secondary me-2" 
                        onClick={() => table.previousPage()} 
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </button>
                    <button 
                        className="btn btn-sm btn-outline-secondary" 
                        onClick={() => table.nextPage()} 
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}