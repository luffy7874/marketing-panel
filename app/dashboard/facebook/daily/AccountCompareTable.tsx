"use client";
import React, { useMemo, useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
    createColumnHelper,
    SortingState,
} from "@tanstack/react-table";
import { FaSort, FaSortDown, FaSortUp, FaArrowUp, FaArrowDown } from "react-icons/fa";

export interface CompareMetric {
    label: string;
    current: number;
    previous: number;
    diff: number;
    percent: number;
    suffix?: string; // Added to handle dynamic units from Laravel
}

export default function AccountCompareTable({ data, date }: { data: any, date?: string }) {
    // Accessing the comparison_data array from the structure we defined in Laravel
    const tableData = useMemo(() => data || [], [data]);
    
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState("");

    const columnHelper = createColumnHelper<CompareMetric>();

    const columns = [
        columnHelper.accessor("label", {
            header: "Metric",
            cell: (info) => <span className="fw-bold text-dark">{info.getValue()}</span>,
        }),
        columnHelper.accessor("current", {
            header: "Current Period",
            cell: (info) => {
                const val = info.getValue();
                const suffix = info.row.original.suffix || "";
                
                if (info.row.original.label.toLowerCase().includes('spend') || 
                    info.row.original.label.toLowerCase().includes('revenue') || 
                    info.row.original.label.toLowerCase().includes('cpm')) {
                    return `₹${val.toLocaleString()}`;
                }
                return `${val.toLocaleString()}${suffix}`;
            },
        }),
        columnHelper.accessor("previous", {
            header: "Previous Period",
            cell: (info) => {
                const val = info.getValue();
                const suffix = info.row.original.suffix || "";

                if (info.row.original.label.toLowerCase().includes('spend') || 
                    info.row.original.label.toLowerCase().includes('revenue') || 
                    info.row.original.label.toLowerCase().includes('cpm')) {
                    return `₹${val.toLocaleString()}`;
                }
                return `${val.toLocaleString()}${suffix}`;
            },
        }),
        columnHelper.accessor("diff", {
            header: "Difference",
            cell: (info) => {
                const val = info.getValue();
                const isPositive = val > 0;
                const suffix = info.row.original.suffix || "";
                
                return (
                    <span className={isPositive ? "text-success" : "text-danger"}>
                        {isPositive ? "+" : ""}{val.toLocaleString()}{suffix}
                    </span>
                );
            },
        }),
        columnHelper.accessor("percent", {
            header: "Change %",
            cell: (info) => {
                const val = info.getValue();
                const isPositive = val > 0;
                // If there's no previous data to compare (val is 0), show neutral
                if (val === 0) return <span className="text-muted small">0%</span>;

                return (
                    <div className={`d-flex align-items-center gap-1 fw-bold ${isPositive ? "text-success" : "text-danger"}`}>
                        {isPositive ? <FaArrowUp size={12} /> : <FaArrowDown size={12} />}
                        {Math.abs(val).toFixed(2)}%
                    </div>
                );
            },
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
        getFilteredRowModel: getFilteredRowModel(),
    });

    if (!data) return <div className="p-5 text-center text-muted">No comparison data available.</div>;

    return (
        <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                {/* <input
                    type="text"
                    className="form-control w-25 shadow-sm"
                    placeholder="Search metrics..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                /> */}
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
                        {table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map(row => (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="text-center py-5 text-muted italic">
                                    No metrics found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}