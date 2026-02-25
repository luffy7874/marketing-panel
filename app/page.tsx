import { redirect } from "next/navigation"


export default function Home() 
{
	redirect("/auth/login");
  	return (
		<div className="page-content">
			<div className="container-fluid">

				{/* <!-- start page title --> */}
				<div className="row">
					<div className="col-12">
						<div className="page-title-box d-sm-flex align-items-center justify-content-between">
							<h4 className="mb-sm-0">Starter</h4>

							<div className="page-title-right">
								<ol className="breadcrumb m-0">
									<li className="breadcrumb-item"><a href="javascript: void(0);">Pages</a></li>
									<li className="breadcrumb-item active">Starter</li>
								</ol>
							</div>

						</div>
					</div>
				</div>
				{/* <!-- end page title --> */}

			</div>
			{/* <!-- container-fluid --> */}
		</div>
			
  	)
}
