"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import ConnectFacebookButton from "../Components/ui/FacebookLoginButton";
import axios from "@/app/libs/axios";
import { AlertData, TokenData } from "@/app/utils/types";


// 2. Main Logic Component
function TokenManager() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [accessTokens, setAccessTokens] = useState<TokenData | null>(null);
    const [alert, setAlert] = useState<AlertData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Fetch Tokens
    useEffect(() => {
        const fetchTokens = async () => {
            try {
                const response = await axios.get(`/api/facebook/get-token`);
                
                if(response.status == 200){

                    setAccessTokens(response.data.facebook_token);
                }
            } catch (error) {
                console.error("Error fetching tokens:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTokens();
    }, [API_URL]);

    // Handle OAuth Callbacks
    useEffect(() => {
        const fbAuthStatus = searchParams.get("fb_auth");

        if (fbAuthStatus) {
            if (fbAuthStatus === "success") {
                setAlert({ type: "success", message: "Facebook Ads connected successfully!" });
            } else if (fbAuthStatus === "error") {
                setAlert({ type: "danger", message: "Failed to connect Facebook Ads. Please try again." });
            }
            // Clean the URL the Next.js way
            router.replace(pathname, { scroll: false });
        }
    }, [searchParams, pathname, router]);

    // Helper: Calculate Remaining Days
    const getRemainingDays = (expiryDateString?: string) => {
        if (!expiryDateString) return 0;

        const expiryDate = new Date(expiryDateString);
        const today = new Date();
        const diffTime = expiryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays > 0 ? diffDays : 0;
    };

    // Helper: Format Date Safely
    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString)
            .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            })
            .replace(/ /g, "-")
            .toLowerCase();
    };

    return (
        <div className="page-content">
            <div className="container-fluid">
                {/* Header */}
                <div className="row">
                    <div className="col-12">
                        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                            <h4 className="mb-sm-0">Tokens</h4>
                            <div className="page-title-right">
                                <ol className="breadcrumb m-0">
                                    <li className="breadcrumb-item text-muted">Pages</li>
                                    <li className="breadcrumb-item active">Tokens</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions & Alerts */}
                <div className="d-flex justify-content-end mb-4 gap-3 align-items-center">
                    {alert && (
                        <div className={`alert alert-${alert.type} alert-dismissible fade show mb-0`} role="alert">
                            {alert.message}
                            <button type="button" className="btn-close" onClick={() => setAlert(null)}></button>
                        </div>
                    )}
                    <ConnectFacebookButton />
                </div>

                {/* Data Table */}
                <div className="card shadow-sm">
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-striped table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th scope="col">Id</th>
                                        <th scope="col">Customer</th>
                                        <th scope="col">Provider</th>
                                        <th scope="col">Access Token</th>
                                        <th scope="col">Refresh Token</th>
                                        <th scope="col">Expires At</th>
                                        <th scope="col">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={7} className="text-center py-4 text-muted">
                                                <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                                Loading tokens...
                                            </td>
                                        </tr>
                                    ) : accessTokens ? (
                                        <tr>
                                            <th scope="row">{accessTokens.id}</th>
                                            <td>{accessTokens.user?.name ?? "Test User"}</td>
                                            <td className="text-capitalize">{accessTokens.provider}</td>
                                            <td className="text-truncate" style={{ maxWidth: '150px' }} title={accessTokens.access_token}>
                                                {accessTokens.access_token}
                                            </td>
                                            <td className="text-truncate" style={{ maxWidth: '150px' }}>
                                                {accessTokens.refresh_token ?? "None"}
                                            </td>
                                            <td>{formatDate(accessTokens.expires_in)}</td>
                                            <td>
                                                {(() => {
                                                    const daysLeft = getRemainingDays(accessTokens.expires_in);
                                                    let badgeClass = "bg-success";
                                                    if (daysLeft < 10) badgeClass = "bg-warning text-dark";
                                                    if (daysLeft < 3) badgeClass = "bg-success";

                                                    return (
                                                        <span className={`badge ${badgeClass} fs-12`}>
                                                            {daysLeft === 0 ? "Never Expires" : `${daysLeft} Days Left`}
                                                        </span>
                                                    );
                                                })()}
                                            </td>
                                        </tr>
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="text-center py-4 text-muted">
                                                No active tokens found. Please connect an account.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// 3. Default Export Wrapped in Suspense
export default function Tokens() {
    return (
        <Suspense fallback={<div className="p-5 text-center"><div className="spinner-border text-primary"></div></div>}>
            <TokenManager />
        </Suspense>
    );
}