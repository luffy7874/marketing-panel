"use client";
import axios from "@/app/libs/axios";
import { useCallback, useEffect, useState } from "react";

export default function FbAccounts()
{

    const [accounts, setAccounts] = useState([]);

    const handleAdAccounts = useCallback(async () => {
        try {
            const response = await axios.get("/api/facebook/ad-accounts");

            if (response.status === 200) {
                setAccounts(response.data);
            }
        } catch (error) {
            console.error("Error fetching ad accounts:", error);
        }
    }, []);

    useEffect(() => {
        handleAdAccounts();
    }, [handleAdAccounts]);

    return (
        <div>
            <h4>Choose Facebook Accounts</h4>
            <select className="form-select mb-3" aria-label="Default select example">
                {accounts.map((account: any, index) => (
                    <option key={index} value={account.id}>
                        {account.name}
                    </option>
                ))}
            </select>
        </div>
    );
}