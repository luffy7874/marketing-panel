"use client"
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react"; // <-- 1. Import Suspense here
import { format, subDays } from "date-fns";
import axios from "@/app/libs/axios";
import ShopifyAccounts from "./Components/ui/ShopifyAccounts";
import TopProductsWidget from "./Components/widgets/TopProductsWidgets";
import TopRegionsWidget from "./Components/widgets/TopRegionsWidgets";
import BreadCrumb from "./Components/ui/BreadCrumb";
import MetaDateRange from "./Components/DateRangePicker";
import { ApiData } from "../utils/types";

// 2. Rename your main function to DashboardContent (remove 'export default')
function DashboardContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // --- STATE ---
    const [apiData, setApiData] = useState<ApiData | null>();
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [store, setStore] = useState<string>("");
    
    // --- TOP LEVEL DATE LOGIC ---
    const from = searchParams.get("from_date");
    const to = searchParams.get("to_date");

    const start = from ? from : format(subDays(new Date(), 6), "yyyy-MM-dd");
    const end = to ? to : format(new Date(), "yyyy-MM-dd");

    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
        new Date(start),
        new Date(end),
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
    useEffect(() => {
        if (!store) return;

        const fetchFromUrl = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/shopify/sales-analysis?shop=${store}&from_date=${start}&to_date=${end}`);
                if(response.status === 200) {
                    setApiData(response.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchFromUrl();
    }, [searchParams, store, start, end]);

    // --- HANDLER ---
    const handleApply = () => {
        if (!dateRange[0] || !dateRange[1]) return;

        const startStr = format(dateRange[0], "yyyy-MM-dd");
        const endStr = format(dateRange[1], "yyyy-MM-dd");
        router.replace(
            `?from_date=${startStr}&to_date=${endStr}`,
            { scroll: false }
        );

        setOpen(false);
    };

    return (
        <div className="page-content">
            <BreadCrumb heading="Dashboard" />
            <div className="container-fluid px-4">
                
                {/* Header & Controls */}
                <div className="d-flex justify-content-between align-items-center">
                    <ShopifyAccounts store={store} setStore={setStore} />

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

                {/* Widgets Grid */}
                <div className="row mt-4">
                    <div className="col-12 col-xl-6">
                        <TopProductsWidget
                            store={store} 
                            fromDate={start} 
                            toDate={end} 
                        />
                    </div>
                    <div className="col-12 col-xl-6">
                        <TopRegionsWidget
                            store={store} 
                            fromDate={start} 
                            toDate={end} 
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}

// 3. Create your new default export that wraps the content in a Suspense boundary
export default function Dashboard() {
    return (
        // The fallback UI will show for a split second while Next.js reads the URL parameters
        <Suspense fallback={<div className="p-5 text-center">Loading dashboard...</div>}>
            <DashboardContent />
        </Suspense>
    );
}