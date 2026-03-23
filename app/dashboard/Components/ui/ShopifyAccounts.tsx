"use client";
import axios from "@/app/libs/axios";
import { useEffect, useState } from "react";

export default function ShopifyAccounts({ store, setStore }: any) {
    const [shop, setShop] = useState([]);
    const [isReady, setIsReady] = useState(false); // 1. The Gatekeeper

    // 2. Wait for the client to fully hydrate and auth to boot up
    useEffect(() => {
        // A tiny 100ms delay is usually enough for localStorage/cookies to be accessible
        const timer = setTimeout(() => {
            setIsReady(true);
        }, 100); 

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // 3. THE SHIELD: Do absolutely nothing until the app is ready
        if (!isReady) return; 

        let isMounted = true; 

        const fetchStores = async () => {
            try {
                const response = await axios.get("/api/shopify/stores");

                if (response.status === 200 && isMounted) {
                    const fetchedStores = response.data.stores;
                    setShop(fetchedStores);

                    setStore((prevStore: any) => {
                        if (!prevStore && fetchedStores.length > 0) {
                            return fetchedStores[0].portfolio_name;
                        }
                        return prevStore; 
                    });
                }
            } catch (error) {
                console.error("Error fetching stores:", error);
            }
        };

        fetchStores();

        return () => { isMounted = false; };
        
    // Add isReady to the dependency array so it triggers when the gate opens
    }, [setStore, isReady]); 

    return (
        <div>
            <label className="form-label">Choose Shopify Store</label>
            <select 
                className="form-select mb-3" 
                value={store || ""} 
                onChange={(e) => setStore(e.target.value)}
            >
                {shop && shop.map((value: any, index) => (
                    <option key={index} value={value.portfolio_name}>
                        {value.portfolio_name}
                    </option>
                ))}
            </select>
        </div>
    );
}