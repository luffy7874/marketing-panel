"use client";
import React, { useMemo, useState } from "react";
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
import { AccountDailyData } from "@/app/utils/types";

// Match this to the data keys we defined in the Laravel fetchAccountDailyReport


export default function AccountTable({ data }: { data: AccountDailyData[];})
{
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState("");

    const columnHelper = createColumnHelper<AccountDailyData>();

    const columns = [
        columnHelper.accessor("date", {
            header: "Date",
            cell: (info) => <span className="fw-medium">{info.getValue()}</span>,
            footer: () => "Total / Avg",
        }),
        columnHelper.accessor("day", {
            header: "Day",
            cell: (info) => <span className="text-muted">{info.getValue()}</span>,
            footer: () => "-",
        }),
        columnHelper.accessor("spend", {
            header: "Spend",
            cell: (info) => `₹${Number(info.getValue()).toLocaleString()}`,
            footer: (info) => {
                const total = info.table.getFilteredRowModel().rows.reduce((sum, row) => sum + row.original.spend, 0);
                return `₹${total.toLocaleString()}`;
            },
        }),
        columnHelper.accessor("sales", {
            header: "Sale",
            cell: (info) => info.getValue(),
            footer: (info) => info.table.getFilteredRowModel().rows.reduce((sum, row) => sum + row.original.sales, 0),
        }),
        columnHelper.accessor("roas", {
            header: "ROAS",
            cell: (info) => <span className={info.getValue() > 2 ? "text-success fw-bold" : ""}>{info.getValue()}</span>,
            footer: (info) => {
                const rows = info.table.getFilteredRowModel().rows;
                const totalSpend = rows.reduce((sum, row) => sum + (Number(row.original.spend) || 0), 0);
                const totalValue = rows.reduce((sum, row) => sum + (Number(row.original.value) || 0), 0);
                
                const accountRoas = totalSpend > 0 ? (totalValue / totalSpend).toFixed(2) : "0.00";
                return <strong>{accountRoas}x</strong>;
            },
        }),
        columnHelper.accessor("add_to_cart", {
            header: "Add to Cart",
            cell: (info) => info.getValue(),
            footer: (info) => {
                const total = info.table
                    .getFilteredRowModel()
                    .rows.reduce((sum, row) => sum + (Number(row.original.add_to_cart) || 0), 0);
                
                return <span>{total.toLocaleString()}</span>;
            },
        }),
        columnHelper.accessor("checkouts", {
            header: "Checkouts",
            cell: (info) => info.getValue(),
            footer: (info) => {
                const total = info.table
                    .getFilteredRowModel()
                    .rows.reduce((sum, row) => sum + (Number(row.original.checkouts) || 0), 0);
                
                return <span>{total.toLocaleString()}</span>;
            },
        }),
        columnHelper.accessor("ctr", {
            header: "Outbound CTR",
            cell: (info) => `${info.getValue()}%`,
        }),
        columnHelper.accessor("cpm", {
            header: "CPM",
            cell: (info) => `₹${info.getValue()}`,
            footer: (info) => {
                const total = info.table.getFilteredRowModel().rows.reduce((sum, row) => sum + row.original.cpm, 0);
                return `₹${total.toLocaleString()}`;
            },
        }),
        columnHelper.accessor("frequency", {
            header: "Freq",
            cell: (info) => info.getValue(),
            footer: (info) => {
                const rows = info.table.getFilteredRowModel().rows;
                const totalImps = rows.reduce((sum, r) => sum + (Number(r.original.impressions) || 0), 0);
                const totalReach = rows.reduce((sum, r) => sum + (Number(r.original.reach) || 0), 0);
                const weightedFreq = totalReach > 0 ? (totalImps / totalReach) : 0;
                return <strong>{weightedFreq.toFixed(2)}x</strong>;
            }
        }),
        columnHelper.accessor("reach", {
            header: "Reach",
            cell: (info) => Number(info.getValue()).toLocaleString(),
            footer: (info) => {
                const total = info.table
                    .getFilteredRowModel()
                    .rows.reduce((sum, row) => sum + (Number(row.original.reach) || 0), 0);
                
                return <span>{total.toLocaleString()}</span>;
            },
        }),
        columnHelper.accessor("impressions", {
            header: "Impressions",
            cell: (info) => Number(info.getValue()).toLocaleString(),
            footer: (info) => {
                const total = info.table
                    .getFilteredRowModel()
                    .rows.reduce((sum, row) => sum + (Number(row.original.impressions) || 0), 0);
                
                return <span>{total.toLocaleString()}</span>;
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
        <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                <div className="filter-options d-flex gap-2 align-items-center">
                    <span className="text-muted small">Show</span>
                    <select
                        className="form-select form-select-sm w-auto"
                        value={table.getState().pagination.pageSize}
                        onChange={e => {
                            table.setPageSize(Number(e.target.value))
                        }}
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
                    placeholder="Filter by date or day..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                />
            </div>

            <div className="table-responsive">
                <table className="table table-hover align-middle mb-0 text-center">
                    <thead className="table-light">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} onClick={header.column.getToggleSortingHandler()} style={{ cursor: 'pointer' }}>
                                        <div className="d-flex align-items-center justify-content-center gap-1">
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
                                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="table-light fw-bold">
                        {table.getFooterGroups().map(footerGroup => (
                            <tr key={footerGroup.id}>
                                {footerGroup.headers.map(header => (
                                    <td key={header.id}>{flexRender(header.column.columnDef.footer, header.getContext())}</td>
                                ))}
                            </tr>
                        ))}
                    </tfoot>
                </table>
            </div>
            <div className="card-footer bg-white d-flex justify-content-between py-3">
                <span className="text-muted">
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
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