"use client";
import { useEffect, useState } from "react";
import { format, subDays } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { ApiData } from "@/app/utils/types";
import TopBarLoader from "@/app/Components/topLoader";
import CompareDatePicker from "@/app/Components/CompareDatePicker";
import CompareTable from "@/app/Components/CompareTable";


export default function Page() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const startParam = searchParams.get("from_date");
    const endParam = searchParams.get("to_date");

    const [apiData, setApiData] = useState<ApiData | null>(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
        startParam ? new Date(startParam) : subDays(new Date(), 6),
        endParam ? new Date(endParam) : new Date(),
    ]);


    useEffect(() => {
        if (!dateRange[0] || !dateRange[1]) return;

        const startStr = format(dateRange[0], "yyyy-MM-dd");
        const endStr = format(dateRange[1], "yyyy-MM-dd");

        // 1. Fetch Data (Always fetch based on current state)
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/facebook/metrices?from_date=${startStr}&to_date=${endStr}`
                );
                if (!response.ok) throw new Error("Failed");
                const data = await response.json();
                setApiData(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();

        const currentStart = searchParams.get("from_date");
        const currentEnd = searchParams.get("to_date");

        if (startStr !== currentStart || endStr !== currentEnd) {
            router.replace(`?from_date=${startStr}&to_date=${endStr}`, { scroll: false });
        }

    }, [dateRange]);



    return (
        <div className="page-content">
            <TopBarLoader isLoading={loading} color="bg-danger" />

            <div className={`container-fluid p-4 ${loading ? 'opacity-50' : ''}`} style={{ transition: 'opacity 0.5s' }}>
                <div className="d-flex justify-content-between">
                    <h3>Compare Ads</h3>
                    <button className="btn btn-primary">🏆 Top Performing</button>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-4 mt-3">
                    <p className="m-0">
                        Total Ads expenses during <span className="text-info">{startParam + " to " + endParam} </span> : 
                        <b className="text-success px-2"> ₹{apiData?.totalSpend.toFixed(2)}</b>
                    </p>
                    <div style={{ position: "relative", display: "inline-block" }}>
                        {apiData && (
                            <div
                            id="date-alert"
                            className="alert alert-info py-1 px-3 mb-0"
                            onClick={() => setOpen(!open)}
                            style={{ cursor: "pointer" }}
                            >
                            Date: <strong>{apiData.date}</strong>
                            </div>
                        )}
                        <CompareDatePicker
                            open={open}
                            setOpen={setOpen}
                            dateRange={dateRange}
                            setDateRange={setDateRange}
                        />
                    </div>
                </div>

                <CompareTable data={apiData || { campaigns: [] }} />
            </div>
        </div>
    );
}
