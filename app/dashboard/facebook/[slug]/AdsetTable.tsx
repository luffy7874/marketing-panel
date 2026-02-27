"use client";
import React, { useEffect, useMemo, useState } from "react";
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
import axios from "@/app/libs/axios";

// Match the AdSet type to your Laravel fetchReport response
export interface AdSet {
    campaign_id: string;
    campaign: string;
    status: string;
    budget: number;  // This is the Active Daily Basis budget
    spend: number;
    roas: number;
    purchases: number;
    value: number;   // Revenue
    impressions: number;
    clicks: number;
}

export default function AdsetTable({ slug }: { slug: string }) {
    // Initialize to match your PHP return structure: campaignBudgets.campaigns
    const [reportData, setReportData] = useState<{ campaigns: AdSet[]; total_spend: number }>({
        campaigns: [],
        total_spend: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/facebook/adsets/${slug}`);
                
                setReportData(response.data.campaignBudgets || { campaigns: [], total_spend: 0 });
            } catch (error) {
                console.error("AdSet fetch failed:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    const tableData = useMemo(() => reportData.campaigns, [reportData]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState("");

    const columnHelper = createColumnHelper<AdSet>();

    const columns = [
        columnHelper.accessor("campaign", {
            header: "AdSet Name",
            cell: (info) => <span className="fw-bold text-primary">{info.getValue()}</span>,
            footer: () => "Total",
        }),
        columnHelper.accessor("status", {
            header: "Status",
            cell: (info) => (
                <span className={`badge ${info.getValue() === "Active" ? "bg-success" : "bg-secondary"}`}>
                    {info.getValue()}
                </span>
            ),
        }),
        columnHelper.accessor("budget", {
            header: "Budget",
            cell: (info) => `₹${Number(info.getValue()).toLocaleString()}`,
        }),
        columnHelper.accessor("spend", {
            header: "Spend",
            cell: (info) => <span className="fw-medium">₹{Number(info.getValue()).toLocaleString()}</span>,
            footer: () => `₹${reportData.total_spend.toLocaleString()}`,
        }),
        columnHelper.accessor("purchases", {
            header: "Purchases",
            cell: (info) => info.getValue() || 0,
        }),
        columnHelper.accessor("value", {
            header: "Revenue",
            cell: (info) => `₹${Number(info.getValue()).toLocaleString()}`,
        }),
        columnHelper.accessor("roas", {
            header: "ROAS",
            cell: (info) => {
                const val = Number(info.getValue());
                return <span className={val > 2 ? "text-success fw-bold" : "text-muted"}>{val}x</span>;
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
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    if (loading) return <div className="p-5 text-center">Loading AdSets...</div>;

    return (
        <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                <h5 className="mb-0">AdSet Performance</h5>
                <input
                    type="text"
                    className="form-control w-25"
                    placeholder="Search AdSets..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                />
            </div>

            <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} onClick={header.column.getToggleSortingHandler()} style={{ cursor: 'pointer' }}>
                                        <div className="d-flex align-items-center gap-1">
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
            {/* Pagination UI logic here */}
        </div>
    );
}