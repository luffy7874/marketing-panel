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
import Link from "next/link";

// 1. Define the AdSet Type based on your PHP Response
export interface AdSet {
    id: string;
    name: string;
    status: string;
    budget: number;
    spend: number;
    roas: number;
    purchases: number;
    revenue: number;
    add_to_cart: number;
    cpp: number;
    start_date: string;
    end_date: string;
}

const parseDate = (dateStr: string) => {
    if (!dateStr || dateStr === "Ongoing") return new Date(9999, 11, 31);
    return new Date(dateStr);
};

// 2. Update Props to accept an Array of AdSets
export default function AdsetTable({ data }: { data: AdSet[] | null }) {
    
    // FIX: Use 'data' directly because your API returns an array
    const tableData = useMemo(() => data || [], [data]);
    
    // FIX: Calculate Total Spend from the rows since API returns a plain array
    const totalSpend = useMemo(() => {
        return tableData.reduce((sum, item) => sum + (Number(item.spend) || 0), 0);
    }, [tableData]);

    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState("");

    const columnHelper = createColumnHelper<AdSet>();

    const columns = [
        columnHelper.accessor("name", {
            header: "Adset Name",
            cell: (info) => (
                // OPTIONAL: If you have an "Ads" level, link to it. Otherwise, remove Link.
                <span className="fw-bold text-primary">
                    {info.getValue()}
                </span>
            ),
            footer: () => "Total",
        }),

        columnHelper.accessor("budget", {
            header: "Budget",
            cell: (info) => `₹${Number(info.getValue()).toLocaleString()}`,
            footer: (info) => {
                const total = info.table
                    .getFilteredRowModel()
                    .rows.reduce((sum, row) => sum + (Number(row.original.budget) || 0), 0);
                return `₹${total.toLocaleString()}`;
            },
        }),

        columnHelper.accessor("spend", {
            header: "Spend",
            cell: (info) => {
                const currentSpend = Number(info.getValue()) || 0;
                // const share = totalSpend > 0 ? (currentSpend / totalSpend) * 100 : 0;
                
                return (
                    <div>
                        <span className="fw-medium">₹{currentSpend.toLocaleString()}</span>
                    </div>
                );
            },
            footer: (info) => {
                const total = info.table
                    .getFilteredRowModel()
                    .rows.reduce((sum, row) => sum + (Number(row.original.spend) || 0), 0);
                return `₹${total.toLocaleString()}`;
            },
        }),

        columnHelper.accessor("purchases", {
            header: "Purchases",
            cell: (info) => info.getValue(),
            footer: (info) => {
                const total = info.table
                    .getFilteredRowModel()
                    .rows.reduce((sum, row) => sum + (Number(row.original.purchases) || 0), 0);
                return total;
            },
        }),

        columnHelper.accessor("revenue", {
            header: "Purchase Value",
            cell: (info) => `₹${Number(info.getValue()).toLocaleString()}`,
            footer: (info) => {
                const total = info.table
                    .getFilteredRowModel()
                    .rows.reduce((sum, row) => sum + (Number(row.original.revenue) || 0), 0);
                return `₹${total.toLocaleString()}`;
            },
        }),

        columnHelper.accessor("add_to_cart", {
            header: "Add to cart",
            cell: (info) => info.getValue(),
            footer: (info) => {
                const total = info.table
                    .getFilteredRowModel()
                    .rows.reduce((sum, row) => sum + (Number(row.original.add_to_cart) || 0), 0);
                return total;
            },
        }),

        columnHelper.accessor("cpp", {
            header: "CPP",
            cell: (info) => `₹${Number(info.getValue()).toLocaleString()}`,
            footer: (info) => {
                const rows = info.table.getFilteredRowModel().rows;
                const totalSpend = rows.reduce((sum, row) => sum + (Number(row.original.spend) || 0), 0);
                const totalPurchases = rows.reduce((sum, row) => sum + (Number(row.original.purchases) || 0), 0);
                const realCPP = totalPurchases > 0 ? (totalSpend / totalPurchases) : 0;
                return `₹${realCPP.toFixed(2)}`;
            },
        }),

        columnHelper.accessor("roas", {
            header: "ROAS",
            cell: (info) => {
                const val = Number(info.getValue());
                return (
                    <span className={val > 2 ? "text-success fw-bold" : val === 0 ? "text-muted" : ""}>
                        {val}
                    </span>
                );
            },
            footer: (info) => {
                const rows = info.table.getFilteredRowModel().rows;
                const totalSpend = rows.reduce((sum, row) => sum + (Number(row.original.spend) || 0), 0);
                const totalValue = rows.reduce((sum, row) => sum + (Number(row.original.revenue) || 0), 0);
                const realROAS = totalSpend > 0 ? (totalValue / totalSpend) : 0;
                return `${realROAS.toFixed(2)}`;
            },
        }),

        columnHelper.accessor("start_date", {
            header: "Start Date",
            sortingFn: (rowA, rowB) => {
                const dateA = parseDate(rowA.original.start_date).getTime();
                const dateB = parseDate(rowB.original.start_date).getTime();
                return dateA - dateB;
            },
            footer: () => "-",
        }),

        columnHelper.accessor("end_date", {
            header: "End Date",
            sortingFn: (rowA, rowB) => {
                const dateA = parseDate(rowA.original.end_date).getTime();
                const dateB = parseDate(rowB.original.end_date).getTime();
                return dateA - dateB;
            },
            footer: () => "-",
        }),

        columnHelper.accessor("status", {
            header: "Status",
            cell: (info) => (
                <span
                    className={`badge ${info.getValue() === "Active" ? "bg-success" : "bg-secondary"}`}
                >
                    {info.getValue()}
                </span>
            ),
            footer: () => "-",
        }),
    ];

    const table = useReactTable({
        data: tableData,
        columns,
        state: { sorting, globalFilter },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    if (!data || data.length === 0) return <div className="p-4 text-center">No ad sets found for this campaign.</div>;

    return (
        <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Ad Sets Performance</h5>
                
                <input
                    type="text"
                    className="form-control w-25"
                    placeholder="Search ad sets..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                />
            </div>

            <div className="table-responsive">
                <table className="table table-hover table-striped table-nowrap align-middle mb-0">
                    <thead className="table-light">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        onClick={header.column.getToggleSortingHandler()}
                                        style={{ cursor: "pointer" }}
                                        className="py-3"
                                    >
                                        <div className="d-flex align-items-center gap-1">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            <span>
                                                {{
                                                    asc: <FaSortUp />,
                                                    desc: <FaSortDown />,
                                                }[header.column.getIsSorted() as string] ?? <FaSort className="text-muted opacity-25" />}
                                            </span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="table-light fw-bold">
                        {table.getFooterGroups().map((footerGroup) => (
                            <tr key={footerGroup.id}>
                                {footerGroup.headers.map((header) => (
                                    <td key={header.id} className="py-3">
                                        {flexRender(header.column.columnDef.footer, header.getContext())}
                                    </td>
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