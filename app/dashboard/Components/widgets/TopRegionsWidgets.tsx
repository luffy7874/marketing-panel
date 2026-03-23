"use client";
import { useEffect, useState } from "react";
import axios from "@/app/libs/axios";

interface RegionData {
    name: string;
    sales: number;
    orders: number;
    returns_percent: number;
}

export default function TopRegionsWidget({ store, fromDate, toDate }: { store: string, fromDate: string, toDate: string }) {
    const [regions, setRegions] = useState<RegionData[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!store || !fromDate || !toDate) return;

        const fetchTopRegions = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/shopify/top-regions?shop=${store}&from_date=${fromDate}&to_date=${toDate}`);
                if (response.status === 200) {
                    setRegions(response.data.top_regions);
                }
            } catch (error) {
                console.error("Failed to fetch top regions", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTopRegions();
    }, [store, fromDate, toDate]);

    const formatINR = (val: number) => `₹${Number(val).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

    return (
        <div className="card shadow-sm border-0 mt-4 h-100">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold">Top 10 Regions</h5>
                {loading && <div className="spinner-border spinner-border-sm text-primary" role="status"></div>}
            </div>
            <div className="card-body p-0">
                <div className="table-responsive">
                    <table className={`table table-hover table-nowrap align-middle mb-0 ${loading ? 'opacity-50' : ''}`} style={{ transition: 'opacity 0.2s' }}>
                        <thead className="table-light">
                            <tr>
                                <th className="ps-4">Region</th>
                                <th className="text-end">Sales Revenue</th>
                                <th className="text-center">Total Orders</th>
                                <th className="text-center pe-4">Return Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {regions.length === 0 && !loading ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-4 text-muted">No sales in this date range.</td>
                                </tr>
                            ) : (
                                regions.map((region, index) => (
                                    <tr key={index}>
                                        <td className="ps-4 text-truncate" style={{ maxWidth: '250px' }} title={region.name}>
                                            <span className="fw-medium text-dark">{region.name}</span>
                                        </td>
                                        <td className="text-end text-success fw-bold">{formatINR(region.sales)}</td>
                                        <td className="text-center">{region.orders}</td>
                                        <td className="text-center pe-4">
                                            <span className={`badge ${region.returns_percent > 10 ? 'bg-danger-subtle text-danger' : 'bg-success-subtle text-success'}`}>
                                                {region.returns_percent}%
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}