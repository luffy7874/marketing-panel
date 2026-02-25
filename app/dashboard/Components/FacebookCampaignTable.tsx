import React, { useMemo, useState, useEffect } from "react";
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
import { Campaign, CampaignResponse } from "../../utils/types"; // Ensure these types exist
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import Link from "next/link";

const parseDate = (dateStr: string) => {
    if (!dateStr || dateStr === "Ongoing") return new Date(9999, 11, 31);
    return new Date(dateStr);
};

export default function CampaignTable({ data, showTop }: { data: CampaignResponse | null, showTop: boolean }) 
{
    
    const { tableData, totalSpend } = useMemo(() => {
        const campaigns = data?.campaigns || [];
        
        const tSpend = data?.total_spend || campaigns.reduce((acc: number, camp: Campaign) => acc + (Number(camp.spend) || 0), 0);

        if (!showTop) {
            return { tableData: campaigns, totalSpend: tSpend };
        }

        const filtered = campaigns.filter((camp: Campaign) => {
            console.log(camp);
            const share = tSpend > 0 ? (Number(camp.spend) / tSpend) * 100 : 0;
            return share > 20;
        });

        return { tableData: filtered, totalSpend: tSpend };
    }, [data, showTop]);

    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState("");

    useEffect(() => {
        if (showTop) {
            setSorting([{ id: "roas", desc: true }]);
        }
    }, [showTop]);

    const columnHelper = createColumnHelper<Campaign>();

    // --- 3. Define Columns ---
    const columns = [
        columnHelper.accessor("campaign", {
            header: "Campaign Name",
            cell: (info) => (
                <Link href={`/facebook/${info.row.original.campaign_id}`} className="fw-bold text-primary text-truncate" style={{ maxWidth: "200px" }}>
                    {info.getValue()}
                </Link>
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
                const currentSpend = Number(info.row.original.spend) || 0;
                const share = totalSpend > 0 ? (currentSpend / totalSpend) * 100 : 0;
                const isTop = share > 20;

                return (
                    <div>
                        <span className="fw-medium">₹{currentSpend.toLocaleString()}</span>
                        {showTop &&isTop && (
                            <div className="badge bg-warning text-dark border border-warning mt-1" style={{ fontSize: '0.65rem', display: 'block', width: 'fit-content' }}>
                                Top {share.toFixed(0)}%
                            </div>
                        )}
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

        columnHelper.accessor("value", {
            header: "Purchase Value",
            cell: (info) => `₹${Number(info.getValue()).toLocaleString()}`,
            footer: (info) => {
                const total = info.table
                    .getFilteredRowModel()
                    .rows.reduce((sum, row) => sum + (Number(row.original.value) || 0), 0);
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

        columnHelper.accessor("frequency", {
            header: "Frequency",
            cell: (info) => Number(info.getValue()).toFixed(2),
            footer: (info) => {
                const rows = info.table.getFilteredRowModel().rows;
                const totalFreq = rows.reduce((sum, row) => sum + (Number(row.original.frequency) || 0), 0);
                const avgFreq = rows.length > 0 ? totalFreq / rows.length : 0;
                return `${avgFreq.toFixed(2)}`;
            },
        }),
        columnHelper.accessor("reach", {
            header: "Reach",
            cell: (info) => Number(info.getValue()).toFixed(2),
            footer: () => {
                return "-";
            },
        }),
        columnHelper.accessor("impressions", {
            header: "Impressions",
            cell: (info) => Number(info.getValue()).toFixed(2),
            footer: () => {
                return "-";
            },
        }),

        columnHelper.accessor("cpp", {
            header: "CPP",
            cell: (info) => `₹${Number(info.getValue()).toLocaleString()}`,
            footer: () => {
                return "-";
            },
        }),
        columnHelper.accessor("cpm", {
            header: "CPM",
            cell: (info) => `₹${Number(info.getValue()).toLocaleString()}`,
            footer: () => {
                return "-";
            },
        }),
        columnHelper.accessor("ctr", {
            header: "CTR",
            cell: (info) => `₹${Number(info.getValue()).toLocaleString()}`,
            footer: () => {
                return "-";
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
                const totalValue = rows.reduce((sum, row) => sum + (Number(row.original.value) || 0), 0);
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

    // --- 4. Initialize Table ---
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

    if (!data || !data.campaigns) return <div className="p-4 text-center">No data available</div>;

    return (
        <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Campaign Performance</h5>
                
                <input
                    type="text"
                    className="form-control w-25"
                    placeholder="Search campaigns..."
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
                        {table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map((row) => (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="text-center py-5 text-muted">
                                    {showTop ? "No campaigns match the Top Performer criteria (>20% Spend Share)." : "No campaigns found."}
                                </td>
                            </tr>
                        )}
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

            {/* Pagination */}
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