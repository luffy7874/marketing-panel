"use client"
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react"; // <-- Added Suspense
import { format, subDays } from "date-fns";
import axios from "@/app/libs/axios";
import TopBarLoader from "../../Components/topLoader";
import BreadCrumb from "../../Components/ui/BreadCrumb";
import ShopifyAccounts from "../../Components/ui/ShopifyAccounts";
import { FaTrophy } from "react-icons/fa6";
import SalesTable from "./SalesTable";
import SalesAnalysisDatepicker from "../../Components/SalesAnalysisDatepicker";
import { ApiData } from "@/app/utils/types";

// 1. Rename the main component to SalesAnalysisContent
function SalesAnalysisContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    // --- STATE ---
    const [apiData, setApiData] = useState<ApiData | null>();
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [showTop, setShowTop] = useState(false);
    const [store, setStore] = useState<string>("");
    const [groupBy, setGroupBy] = useState<string>(searchParams.get("group_by") || "monthly");
    
    // Main Date Range
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
        searchParams.get("from_date") ? new Date(searchParams.get("from_date")!) : subDays(new Date(), 6),
        searchParams.get("to_date") ? new Date(searchParams.get("to_date")!) : new Date(),
    ]);

    // --- FETCH LOGIC ---
    useEffect(() => {
        if (!store) return;

        const from = searchParams.get("from_date");
        const to = searchParams.get("to_date");

        const start = from ? from : format(subDays(new Date(), 6), "yyyy-MM-dd");
        const end = to ? to : format(new Date(), "yyyy-MM-dd");

        const fetchFromUrl = async () => {
            setLoading(true);

            try {
                const response = await axios.get(`/api/shopify/sales-analysis?shop=${store}&from_date=${start}&to_date=${end}&group_by=${groupBy}`); // <-- Make sure groupBy is in this URL too!
                if(response.status == 200){
                    setApiData(response.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchFromUrl();
    }, [searchParams, store, groupBy]); // <-- Added groupBy to dependency array


    // --- HANDLER ---
    const handleApply = () => {
        if (!dateRange[0] || !dateRange[1]) return;

        const startStr = format(dateRange[0], "yyyy-MM-dd");
        const endStr = format(dateRange[1], "yyyy-MM-dd");
        
        router.replace(
            `?from_date=${startStr}&to_date=${endStr}&group_by=${groupBy}`,
            { scroll: false }
        );

        setOpen(false);
    };

    return(
        <div className="page-content">
            <TopBarLoader isLoading={loading} color="bg-danger" />

            <BreadCrumb heading="Shopify Sales Analysis" />
            
            <div className={`container-fluid p-4 ${loading ? 'opacity-50' : ''}`} style={{ transition: 'opacity 0.2s' }}>
                <h4 className="mb-0">Sales Analysis for <span className="text-info">{apiData?.date ? `${apiData.date}` : ""}</span></h4>
                <div className="d-flex justify-content-between align-items-center mt-3">
                    
                    <ShopifyAccounts store={store} setStore={setStore} />

                    <div style={{ position: "relative", display: "inline-block" }}>
                        <div
                            className="alert alert-info py-1 px-3 mb-0"
                            onClick={() => setOpen(!open)}
                            style={{ cursor: "pointer" }}
                        >
                            Date: <strong>{apiData?.date || "Select Date"}</strong>
                        </div>
                        
                        <SalesAnalysisDatepicker
                            open={open}
                            setOpen={setOpen}
                            dateRange={dateRange}
                            setDateRange={setDateRange}
                            groupBy={groupBy}            
                            setGroupBy={setGroupBy}      
                            onApply={handleApply}
                        />
                    </div>
                    
                </div>

                <SalesTable data={apiData?.data || []} />
                
            </div>
        </div>
    );
}

// 2. Export the Suspense Wrapper
export default function SalesAnalysis() {
    return (
        <Suspense fallback={<div className="page-content p-5 text-center">Loading Sales Analysis...</div>}>
            <SalesAnalysisContent />
        </Suspense>
    );
}