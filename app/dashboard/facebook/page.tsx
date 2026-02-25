"use client";
import { useEffect, useState } from "react";
import { format, subDays } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import TopBarLoader from "../Components/topLoader";
import CampaignTable from "../Components/FacebookCampaignTable";
import CompareTable from "../Components/CompareTable"; // Ensure this import is correct
import MetaDateRange from "../Components/DateRangePicker";
import { ApiData } from "../../utils/types";
import { FaTrophy } from "react-icons/fa6";
import axios from "@/app/libs/axios";

export default function Facebook() 
{
    const router = useRouter();
    const searchParams = useSearchParams();
    // --- STATE ---
    const [apiData, setApiData] = useState<ApiData | null>(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [showTop, setShowTop] = useState(false);
    
    // Main Date Range
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
        searchParams.get("from_date") ? new Date(searchParams.get("from_date")!) : subDays(new Date(), 6),
        searchParams.get("to_date") ? new Date(searchParams.get("to_date")!) : new Date(),
    ]);

    // Compare Logic
    const [compare, setCompare] = useState<boolean>(
        searchParams.get("compareMode") === "true" || false
    );
    const [compareMode, setCompareMode] = useState<boolean>(
        searchParams.get("compareMode") === "true" || false
    );
    const [compareRange, setCompareRange] = useState<[Date | null, Date | null]>([
        searchParams.get("compare_from_date") ? new Date(searchParams.get("compare_from_date")!) : subDays(new Date(), 13),
        searchParams.get("compare_to_date") ? new Date(searchParams.get("compare_to_date")!) : subDays(new Date(), 7),
    ]);

    // --- FETCH LOGIC ---

    useEffect(() => 
    {
        const from = searchParams.get("from_date");
        const to = searchParams.get("to_date");

        const start = from ? from : format(subDays(new Date(), 6), "yyyy-MM-dd");
        const end = to ? to : format(new Date(), "yyyy-MM-dd");

        const fetchFromUrl = async () => {
            setLoading(true);

            try {
                if (searchParams.get("compareMode") === "true") {
                    const response = await axios.get(`/api/facebook/metrices/compare?${searchParams.toString()}`);
                    if(response.status == 200){
                        setApiData(response.data);
                        setCompareMode(true);
                    }
                } else {
                    const response = await axios.get(`/api/facebook/metrices?from_date=${start}&to_date=${end}`);
                    if(response.status == 200){
                        setApiData(response.data);
                        setCompareMode(false);
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchFromUrl();
    }, [searchParams]);


    // --- HANDLER ---
    const handleApply = () =>
    {
        if (!dateRange[0] || !dateRange[1]) return;

        const startStr = format(dateRange[0], "yyyy-MM-dd");
        const endStr = format(dateRange[1], "yyyy-MM-dd");

        if (compare && compareRange[0] && compareRange[1])
        {
            const compareStart = format(compareRange[0], "yyyy-MM-dd");
            const compareEnd = format(compareRange[1], "yyyy-MM-dd");

            router.replace(
                `?from_date=${startStr}&to_date=${endStr}&compare_from_date=${compareStart}&compare_to_date=${compareEnd}&compareMode=true`,
                { scroll: false }
            );
        } 
        else {
            router.replace(
                `?from_date=${startStr}&to_date=${endStr}`,
                { scroll: false }
            );
        }

        setOpen(false);
    };


    return (
        <div className="page-content">
            <TopBarLoader isLoading={loading} color="bg-danger" />

            <div className={`container-fluid p-4 ${loading ? 'opacity-50' : ''}`} style={{ transition: 'opacity 0.2s' }}>
                <div className="d-flex justify-content-between">
                    <h3>Facebook Ads Dashboard</h3>
                    <button 
                        className={`btn d-flex align-items-center gap-2 ${showTop ? 'btn-warning text-dark fw-bold' : 'btn-outline-primary'}`}
                        onClick={() => setShowTop(!showTop)}
                    >
                        <FaTrophy className={showTop ? "text-dark" : "text-warning"} />
                        {showTop ? "Showing Top Performers" : "Show Top Performers"}
                    </button>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4 mt-3">
                    <p className="m-0">
                        {/* Safe check for totalSpend using optional chaining */}
                        Total Ads expenses: <b className="text-success px-2">₹{(apiData?.total_spend || 0).toFixed(2)}</b>
                    </p>
                    
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
                    <CompareTable data={apiData} showTop={showTop} />
                ) : (
                    <CampaignTable data={apiData} showTop={showTop} />
                )}
            </div>
        </div>
    );
}