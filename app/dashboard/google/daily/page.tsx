"use client";
import { Suspense, useEffect, useState } from "react";
import { format, subDays } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import MetaDateRange from "@/app/dashboard/Components/DateRangePicker";
import axios from "@/app/libs/axios";
import FbAccounts from "@/app/dashboard/Components/ui/FbAccounts";
import BreadCrumb from "../../Components/ui/BreadCrumb";
import AccountCompareTable from "./AccountCompareTable";
import AccountTable from "./AccountTable";

function GoogleAccountManage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [apiData, setApiData] = useState<any>(null);
    const [open, setOpen] = useState(false);
    
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>(
        [
            searchParams.get("from_date") ? new Date(searchParams.get("from_date")!) : subDays(new Date(), 6),
            searchParams.get("to_date") ? new Date(searchParams.get("to_date")!) : new Date(),
        ]
    );

    const [compare, setCompare] = useState<boolean>(searchParams.get("compareMode") === "true");
    const [compareMode, setCompareMode] = useState<boolean>(searchParams.get("compareMode") === "true");
    
    const [compareRange, setCompareRange] = useState<[Date | null, Date | null]>(
        [
            searchParams.get("compare_from_date") ? new Date(searchParams.get("compare_from_date")!) : subDays(new Date(), 13),
            searchParams.get("compare_to_date") ? new Date(searchParams.get("compare_to_date")!) : subDays(new Date(), 7),
        ]
    );

    // --- FETCH LOGIC ---
    useEffect(() => {
        const from = searchParams.get("from_date") || format(subDays(new Date(), 1), "yyyy-MM-dd");
        const to = searchParams.get("to_date") || format(new Date(), "yyyy-MM-dd");

        const fetchFromUrl = async () => {
            try {
                if (searchParams.get("compareMode") === "true") {
                    const response = await axios.get(`/api/google/daily-data/compare?${searchParams.toString()}`);
                    if (response.status === 200) {
                        setApiData(response.data);
                        console.log(response.data);
                        setCompareMode(true);
                    }
                } else {
                    // Standard Daily Account Data Fetch
                    const response = await axios.get(`/api/google/daily-data?from_date=${from}&to_date=${to}`);
                    if (response.status === 200) {
                        setApiData(response.data);
                        setCompareMode(false);
                    }
                }
            } catch (err) {
                console.error("Dashboard Fetch Error:", err);
            }
        };

        fetchFromUrl();
    }, [searchParams]);

    // --- HANDLER ---
    const handleApply = () => {
        if (!dateRange[0] || !dateRange[1]) return;

        const startStr = format(dateRange[0], "yyyy-MM-dd");
        const endStr = format(dateRange[1], "yyyy-MM-dd");

        if (compare && compareRange[0] && compareRange[1]) {
            const compareStart = format(compareRange[0], "yyyy-MM-dd");
            const compareEnd = format(compareRange[1], "yyyy-MM-dd");

            router.replace(
                `?from_date=${startStr}&to_date=${endStr}&compare_from_date=${compareStart}&compare_to_date=${compareEnd}&compareMode=true`,
                { scroll: false }
            );
        } else {
            router.replace(`?from_date=${startStr}&to_date=${endStr}`, { scroll: false });
        }
        setOpen(false);
    };

    return (
        <div className="page-content">
            
            <BreadCrumb heading="Google Daily Account Performance" />

            <div className="container-fluid px-4 pt-2">

                <h4 className="mb-0">Account Performance from <span className="text-info">{apiData?.date}</span></h4>

                {/* <div className="d-flex justify-content-between align-items-center mb-4 mt-3">
                    
                </div> */}

                <div className="d-flex justify-content-between align-items-center mb-2 mt-3">
                    {/* <p className="m-0">
                        Total Ads expenses: <b className="text-success px-2">₹{(apiData?.total_spend || 0).toFixed(2)}</b>
                    </p> */}

                    <FbAccounts />
                    
                    <div style={{ position: "relative", display: "inline-block" }}>
                        <div
                            className="alert alert-info py-1 px-3 mb-0"
                            onClick={() => setOpen(!open)}
                            style={{ cursor: "pointer" }}
                        >
                            Date: <strong>{apiData?.date || "Select Date"}</strong>
                        </div>
                        
                        <MetaDateRange
                            open={open}
                            setOpen={setOpen}
                            dateRange={dateRange}
                            setDateRange={setDateRange}
                            compare={compare}
                            setCompare={setCompare}
                            compareRange={compareRange}
                            setCompareRange={setCompareRange}
                            onApply={handleApply}
                        />
                    </div>
                </div>

                {/* CONDITIONAL RENDERING */}
                {compareMode ? (
                    <AccountCompareTable data={apiData?.comparison_data || []} date={apiData?.date} />
                ) : (
                    <AccountTable data={apiData?.daily_reports || []} />
                )}
            </div>
        </div>
    );
}

export default function GoogleAccountManagePage() {
    return (
        <Suspense fallback={<div className="p-5 text-center"><div className="spinner-border text-primary"></div></div>}>
            <GoogleAccountManage />
        </Suspense>
    );
}