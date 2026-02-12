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
import { Campaign, CampaignResponse } from "../utils/types";


const parseDate = (dateStr: string) => {
	if (!dateStr || dateStr === "Ongoing") return new Date(9999, 11, 31);
	return new Date(dateStr);
};

export default function CampaignTable({ data }: { data: CampaignResponse }) 
{
	const tableData = useMemo(() => data.campaigns || [], [data]);
	
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState("");

	const columnHelper = createColumnHelper<Campaign>();

	// --- 3. Define Columns ---
	const columns = [
        columnHelper.accessor("campaign", {
            header: "Campaign Name",
            cell: (info) => info.getValue(),
            footer: () => "Total",
        }),

        columnHelper.accessor("budget", {
            header: "Budget",
            cell: (info) => `₹${info.getValue().toLocaleString()}`,
            footer: (info) => {
                const total = info.table
                    .getFilteredRowModel()
                    .rows.reduce((sum, row) => sum + row.original.budget, 0);
                return `₹${total.toLocaleString()}`;
            },
        }),

        columnHelper.accessor("spend", {
            header: "Spend",
            cell: (info) => `₹${info.getValue().toLocaleString()}`,
            footer: (info) => {
                const total = info.table
                    .getFilteredRowModel()
                    .rows.reduce((sum, row) => sum + row.original.spend, 0);
                return `₹${total.toLocaleString()}`;
            },
        }),

        columnHelper.accessor("purchases", {
            header: "Purchases",
            cell: (info) => info.getValue(),
            footer: (info) => {
                const total = info.table
                    .getFilteredRowModel()
                    .rows.reduce((sum, row) => sum + row.original.purchases, 0);
                return total;
            },
        }),

        columnHelper.accessor("value", {
            header: "Purchase Value",
            cell: (info) => `₹${info.getValue().toLocaleString()}`,
            footer: (info) => {
                const total = info.table
                    .getFilteredRowModel()
                    .rows.reduce((sum, row) => sum + row.original.value, 0);
                return `₹${total.toLocaleString()}`;
            },
        }),
        columnHelper.accessor("add_to_cart", {
            header: "Add to cart",
            cell: (info) => info.getValue(),
            footer: (info) => {
                const total = info.table
                    .getFilteredRowModel()
                    .rows.reduce((sum, row) => sum + row.original.add_to_cart, 0);
                return total;
            },
        }),

        columnHelper.accessor("frequency", {
            header: "Frequency",
            cell: (info) => info.getValue(),
            footer: (info) => {
                const rows = info.table.getFilteredRowModel().rows;
                const totalFreq = rows.reduce((sum, row) => sum + row.original.frequency, 0);
                const avgFreq = totalFreq / (rows.length || 1);
                return `${avgFreq.toFixed(2)}`;
            },
        }),

        columnHelper.accessor("cpp", {
            header: "CPP (COST/Purchase)",
            cell: (info) => info.getValue(),
            footer: (info) => {
                const rows = info.table.getFilteredRowModel().rows;
                
                const totalSpend = rows.reduce((sum, row) => sum + row.original.spend, 0);
                const totalPurchases = rows.reduce((sum, row) => sum + row.original.purchases, 0);

                const realCPP = totalPurchases > 0 ? (totalSpend / totalPurchases) : 0;

                return `${realCPP.toFixed(2)}`;
            },
        }),

        columnHelper.accessor("roas", {
            header: "ROAS",
            cell: (info) => {
                const val = info.getValue();
                return (
                    <span className={val > 2 ? "text-success fw-bold" : val === 0 ? "text-muted" : ""}>
                        {val}
                    </span>
                );
            },
            footer: (info) => {
                const rows = info.table.getFilteredRowModel().rows;
                
                const totalSpend = rows.reduce((sum, row) => sum + row.original.spend, 0);
                const totalValue = rows.reduce((sum, row) => sum + row.original.value, 0);

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
					className={`badge ${
						info.getValue() === "Active"
							? "bg-success"
							: "bg-secondary"
					}`}
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
		getSortedRowModel: getSortedRowModel(),     // Enables Sorting
		getPaginationRowModel: getPaginationRowModel(), // Enables Pagination
		getFilteredRowModel: getFilteredRowModel(), // Enables Search
  	});

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
								>
									{flexRender(header.column.columnDef.header, header.getContext())}
									{{
										asc: " 🔼",
										desc: " 🔽",
									}[header.column.getIsSorted() as string] ?? null}
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
							<td colSpan={columns.length} className="text-center py-4">
								No campaigns found.
							</td>
						</tr>
					)}
				</tbody>
				<tfoot className="table-light">
					{table.getFooterGroups().map((footerGroup) => (
						<tr key={footerGroup.id}>
						{footerGroup.headers.map((header) => (
							<th key={header.id}>
							{flexRender(
								header.column.columnDef.footer,
								header.getContext()
							)}
							</th>
						))}
						</tr>
					))}
				</tfoot>
			</table>
		</div>

			{/* 📄 Pagination */}
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