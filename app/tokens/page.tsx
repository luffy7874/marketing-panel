"use client";
import { useEffect, useState } from "react";


export default function Tokens() 
{

    const API_URL: string | undefined = process.env.NEXT_PUBLIC_API_URL;
    console.log("API_URL:", API_URL);

    const [accessTokens, setAccessTokens] = useState<any>(null);

    useEffect(() => 
    {
        const fetchTokens = async () => {
            try{
                const response = await fetch(`${API_URL}/facebook/get-token`);
                const data = await response.json();
                setAccessTokens(data.facebook_token);
            }catch(error){
                console.error("Error fetching tokens:", error);
            }
        }
        fetchTokens();
    }, []);
    

    const getRemainingDays = (expiryDateString: any) => {
        if (!expiryDateString) return 0;

        const expiryDate = new Date(expiryDateString);
        const today = new Date();

        // Calculate difference in milliseconds
        const diffTime = expiryDate - today;

        // Convert to days (1000ms * 60s * 60m * 24h)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // If expired, return 0 instead of negative numbers
        return diffDays > 0 ? diffDays : 0;
    };

  	return (
		<div className="page-content">
			<div className="container-fluid">
				{/* <!-- start page title --> */}
				<div className="row">
					<div className="col-12">
						<div className="page-title-box d-sm-flex align-items-center justify-content-between">
							<h4 className="mb-sm-0">Tokens</h4>

							<div className="page-title-right">
								<ol className="breadcrumb m-0">
									<li className="breadcrumb-item"><a href="javascript: void(0);">Pages</a></li>
									<li className="breadcrumb-item active">Tokens</li>
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
                            <th scope="col">Provider</th>
                            <th scope="col">Access Token</th>
                            <th scope="col">Refresh Token</th>
                            <th scope="col">Expires At</th>
                            <th scope="col">Remaining Days</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">{accessTokens?.id}</th>
                            <td>Test</td>
                            <td>{accessTokens?.provider}</td>
                            <td className="text-small-cell">{accessTokens?.access_token}</td>
                            <td className="text-small-cell">{accessTokens?.refresh_token ?? "None"}</td>
                            <td>{new Date(accessTokens?.expires_in)
                                    .toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    })
                                    .replace(/ /g, "-")
                                    .toLowerCase()}
                            </td>
                            <td>{(() => {
                                    const daysLeft = getRemainingDays(accessTokens?.expires_in);
                                    let badgeClass = "bg-success";
                                    if (daysLeft < 10) badgeClass = "bg-warning";
                                    if (daysLeft < 3) badgeClass = "bg-danger";

                                    return (
                                        <span className={`fs-12 badge ${badgeClass}`}>
                                            {daysLeft === 0 ? "Expired" : `${daysLeft} Days`}
                                        </span>
                                    );
                                })()}
                            </td>
                        </tr>
                    </tbody>
                </table>

			</div>
			{/* <!-- end container-fluid --> */}
		</div>
			
  	)
}
