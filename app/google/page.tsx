"use client"
import Image from "next/image";
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useMemo } from "react";

export default function Google() 
{
    const data = useMemo(
        () => [
            { id: 1, name: 'Facebook Ads', clicks: 120, spend: 500 },
            { id: 2, name: 'Google Ads', clicks: 90, spend: 420 },
            { id: 3, name: 'Instagram Ads', clicks: 150, spend: 610 },
            { id: 4, name: 'Twitter Ads', clicks: 60, spend: 300 },
            { id: 5, name: 'LinkedIn Ads', clicks: 40, spend: 280 },
        ],
        []
    );

    const columns = useMemo(
        () => [
        {
            accessorKey: 'id',
            header: 'ID',
        },
        {
            accessorKey: 'name',
            header: 'Campaign',
        },
        {
            accessorKey: 'clicks',
            header: 'Clicks',
        },
        {
            accessorKey: 'spend',
            header: 'Spend ($)',
        },
        ],
        []
    );

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });
  	return (
		<div className="page-content">
			<div className="container-fluid">
				{/* <!-- start page title --> */}
				<div className="row">
					<div className="col-12">
						<div className="page-title-box d-sm-flex align-items-center justify-content-between">
							<h4 className="mb-sm-0">Google</h4>

							<div className="page-title-right">
								<ol className="breadcrumb m-0">
									<li className="breadcrumb-item"><a href="javascript: void(0);">Pages</a></li>
									<li className="breadcrumb-item active">Google</li>
								</ol>
							</div>

						</div>
					</div>
				</div>
                {/* <!-- Striped Rows --> */}
                <table className="table table-bordered table-striped">
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                            <th key={header.id}>
                                {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                                )}
                            </th>
                            ))}
                        </tr>
                        ))}
                    </thead>

                    <tbody>
                        {table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                            <td key={cell.id}>
                                {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                                )}
                            </td>
                            ))}
                        </tr>
                        ))}
                    </tbody>
                    </table>

			</div>
			{/* <!-- end container-fluid --> */}
		</div>
			
  	)
}
