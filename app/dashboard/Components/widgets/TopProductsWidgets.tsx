"use client";
import { useEffect, useState } from "react";
import axios from "@/app/libs/axios";

interface ProductData {
    name: string;
    sales: number;
    orders: number;
    returns_percent: number;
}

export default function TopProductsWidget({ store, fromDate, toDate }: { store: string, fromDate: string, toDate: string }) {
    const [products, setProducts] = useState<ProductData[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!store || !fromDate || !toDate) return;

        const fetchTopProducts = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/shopify/top-products?shop=${store}&from_date=${fromDate}&to_date=${toDate}`);
                if (response.status === 200) {
                    setProducts(response.data.top_products);
                }
            } catch (error) {
                console.error("Failed to fetch top products", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTopProducts();
    }, [store, fromDate, toDate]); // Re-fetches automatically when the parent date picker changes!

    const formatINR = (val: number) => `₹${Number(val).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

    return (
        <div className="card shadow-sm border-0 mt-4 h-100">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold">Top 10 Products</h5>
                {loading && <div className="spinner-border spinner-border-sm text-primary" role="status"></div>}
            </div>
            <div className="card-body p-0">
                <div className="table-responsive">
                    <table className={`table table-hover table-nowrap align-middle mb-0 ${loading ? 'opacity-50' : ''}`} style={{ transition: 'opacity 0.2s' }}>
                        <thead className="table-light">
                            <tr>
                                <th className="ps-4">Product Name</th>
                                <th className="text-end">Sales Revenue</th>
                                <th className="text-center">Total Orders</th>
                                <th className="text-center pe-4">Return Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 && !loading ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-4 text-muted">No products sold in this date range.</td>
                                </tr>
                            ) : (
                                products.map((product, index) => (
                                    <tr key={index}>
                                        <td className="ps-4 text-truncate" style={{ maxWidth: '300px' }} title={product.name}>
                                            <span className="fw-medium text-dark">{product.name}</span>
                                        </td>
                                        <td className="text-end text-success fw-bold">{formatINR(product.sales)}</td>
                                        <td className="text-center">{product.orders}</td>
                                        <td className="text-center pe-4">
                                            <span className={`badge ${product.returns_percent > 10 ? 'bg-danger-subtle text-danger' : 'bg-success-subtle text-success'}`}>
                                                {product.returns_percent}%
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