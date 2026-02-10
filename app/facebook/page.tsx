import Image from "next/image";

export default function Facebook() {
  	return (
		<div className="page-content">
			<div className="container-fluid">
				{/* <!-- start page title --> */}
				<div className="row">
					<div className="col-12">
						<div className="page-title-box d-sm-flex align-items-center justify-content-between">
							<h4 className="mb-sm-0">Facebook</h4>

							<div className="page-title-right">
								<ol className="breadcrumb m-0">
									<li className="breadcrumb-item"><a href="javascript: void(0);">Pages</a></li>
									<li className="breadcrumb-item active">Facebook</li>
								</ol>
							</div>

						</div>
					</div>
				</div>
                {/* <!-- Striped Rows --> */}
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">Id</th>
                            <th scope="col">Customer</th>
                            <th scope="col">Date</th>
                            <th scope="col">Invoice</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">1</th>
                            <td>Bobby Davis</td>
                            <td>Nov 14, 2021</td>
                            <td>$2,410</td>
                            <td><span className="badge bg-success">Confirmed</span></td>
                        </tr>
                        <tr>
                            <th scope="row">2</th>
                            <td>Christopher Neal</td>
                            <td>Nov 21, 2021</td>
                            <td>$1,450</td>
                            <td><span className="badge bg-warning">Waiting</span></td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td>Monkey Karry</td>
                            <td>Nov 24, 2021</td>
                            <td>$3,500</td>
                            <td><span className="badge bg-success">Confirmed</span></td>
                        </tr>
                        <tr>
                            <th scope="row">4</th>
                            <td>Aaron James</td>
                            <td>Nov 25, 2021</td>
                            <td>$6,875</td>
                            <td><span className="badge bg-danger">Cancelled</span></td>
                        </tr>
                    </tbody>
                </table>

			</div>
			{/* <!-- end container-fluid --> */}
		</div>
			
  	)
}
