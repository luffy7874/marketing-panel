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
import { FaArrowUp, FaArrowDown, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

const parseDate = (dateStr: string) => {
    if (!dateStr || dateStr === "Ongoing") return new Date(9999, 11, 31);
    return new Date(dateStr);
};

// --- CELL COMPONENT ---
const CompareCell = ({ current, prev, isCurrency = false }: any) => {
    const safeCurrent = Number(current) || 0;
    const safePrev = Number(prev) || 0;

    const fmt = (val: number) =>
        isCurrency
            ? "₹" + val.toLocaleString()
            : val.toLocaleString(undefined, { maximumFractionDigits: 2 });

    let Icon = null;
    let colorClass = "text-muted";

    if (safeCurrent > safePrev) {
        Icon = FaArrowUp;
        colorClass = "text-success";
    } else if (safeCurrent < safePrev) {
        Icon = FaArrowDown;
        colorClass = "text-danger";
    }

    return (
        <div className="d-flex flex-column align-items-center justify-content-center">
            <div className="d-flex align-items-center">
                <span className="fw-400 text-dark" style={{ fontSize: "14px" }}>
                    {fmt(safeCurrent)}
                </span>
                {safePrev > 0 && Icon && (
                    <Icon size={10} className={`ms-1 ${colorClass}`} />
                )}
            </div>
            <div className="text-muted" style={{ fontSize: "0.75rem", marginTop: "-2px" }}>
                {safePrev > 0 ? fmt(safePrev) : "-"}
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---
export default function CompareTable({ data, showTop, dataOf }: { data: any, showTop: boolean, dataOf: string }) 
{
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState("");

    const processedData = useMemo(() => {
        const campaigns = data?.campaigns || [];
        
        const totalSpend = data?.total_spend || campaigns.reduce((acc: number, curr: any) => acc + (Number(curr.spend) || 0), 0);

        if (!showTop) return campaigns;

        return campaigns.filter((camp: any) => {
            const share = totalSpend > 0 ? (Number(camp.spend) / totalSpend) * 100 : 0;
            return share > 20;
        });
    }, [data, showTop]);

    useEffect(() => {
        if (showTop) {
            setSorting([{ id: "roas", desc: true }]);
        }
    }, [showTop]);

    const columnHelper = createColumnHelper<any>();

    const columns = [
        columnHelper.accessor("campaign_name", {
            header: "Campaign Name",
            cell: (info) => (
                <div className="text-start ps-3 fw-bold text-primary text-truncate" style={{ maxWidth: "200px" }}>
                    {info.getValue()}
                </div>
            ),
        }),
        columnHelper.accessor("budget", {
            header: "Budget",
            cell: (info) => (
                <div className="text-secondary fw-medium">
                    {"₹" + Number(info.getValue()).toLocaleString()}
                </div>
            ),
        }),
        columnHelper.accessor("spend", {
            header: "Spend",
            cell: (info) => {
                const currentSpend = Number(info.row.original.spend) || 0;
                // Calculate share for badge
                const totalSpend = data?.total_spend || 1; 
                const share = (currentSpend / totalSpend) * 100;
                const isTop = share > 20;

                return (
                    <div>
                        <CompareCell
                            current={currentSpend}
                            prev={info.row.original.prev_spend}
                            isCurrency={true}
                        />
                        {/* Visual indicator for Top Performers */}
                        {showTop &&isTop && (
                            <span className="badge bg-warning text-dark border border-warning mt-1" style={{ fontSize: '0.65rem' }}>
                                Top {share.toFixed(0)}%
                            </span>
                        )}
                    </div>
                );
            },
        }),
        columnHelper.accessor("purchases", {
            header: "Purchases",
            cell: (info) => (
                <CompareCell
                    current={info.row.original.purchases}
                    prev={info.row.original.prev_purchases}
                />
            ),
        }),
        columnHelper.accessor("value", {
            header: "Purchase Value",
            cell: (info) => (
                <CompareCell
                    current={info.row.original.value}
                    prev={info.row.original.prev_value}
                    isCurrency={true}
                />
            ),
        }),
        columnHelper.accessor("add_to_cart", {
            header: "Add to cart",
            cell: (info) => (
                <CompareCell
                    current={info.row.original.add_to_cart}
                    prev={info.row.original.prev_add_to_cart}
                />
            ),
        }),
        columnHelper.accessor("frequency", {
            header: "Frequency",
            cell: (info) => (
                <CompareCell
                    current={info.row.original.frequency}
                    prev={info.row.original.prev_frequency}
                />
            ),
        }),
        columnHelper.accessor("cpp", {
            header: "CPP",
            cell: (info) => (
                <CompareCell
                    current={info.row.original.cpp}
                    prev={info.row.original.prev_cpp}
                    isCurrency={true}
                />
            ),
        }),
        columnHelper.accessor("roas", {
            header: "ROAS",
            cell: (info) => (
                <CompareCell
                    current={info.row.original.roas}
                    prev={info.row.original.prev_roas}
                />
            ),
        }),
        columnHelper.accessor("start_date", {
            header: "Start Date",
            sortingFn: (rowA, rowB) => {
                const dateA = parseDate(rowA.original.start_date).getTime();
                const dateB = parseDate(rowB.original.start_date).getTime();
                return dateA - dateB;
            }
        }),
        columnHelper.accessor("end_date", {
            header: "End Date",
            sortingFn: (rowA, rowB) => {
                const dateA = parseDate(rowA.original.end_date).getTime();
                const dateB = parseDate(rowB.original.end_date).getTime();
                return dateA - dateB;
            }
        }),
        columnHelper.accessor("status", {
            header: "Status",
            cell: (info) => (
                <span
                    className={`badge ${info.getValue() === "Active"
                        ? "bg-success"
                        : "bg-secondary"
                    }`}
                >
                    {info.getValue()}
                </span>
            )
        }),
    ];

    const table = useReactTable({
        data: processedData,
        columns,
        state: { 
            sorting,
            globalFilter,
            columnVisibility: {
                frequency: dataOf !== 'google', // hides if true
                reach: dataOf !== 'google',     // hides if true
            }
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    if (!data || !data.campaigns) return <div className="p-4 text-center">No comparison data found</div>;

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
                    placeholder="Search campaigns..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                />
            </div>

            <div className="table-responsive">
                <table className="table table-hover table-striped table-nowrap align-middle mb-0 text-center">
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
                                        <div className="d-flex align-items-center justify-content-center">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            <span className="ms-2">
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
                                    {/* FIX: Use 'showTop' prop here instead of 'showTopPerformers' */}
                                    {showTop
                                        ? "No campaigns match the Top Performer criteria (>20% Spend Share)."
                                        : "No campaigns found."}
                                </td>
                            </tr>
                        )}
                    </tbody>
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