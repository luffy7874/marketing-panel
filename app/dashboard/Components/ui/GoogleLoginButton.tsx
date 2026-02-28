'use client';
import axios from '@/app/libs/axios';
import { useState } from 'react';
import { FaGoogle } from "react-icons/fa";

export default function ConnectGoogleButton() {
    const [loading, setLoading] = useState(false);

    const handleConnect = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/google-ads/redirect');

            if (response.data.url) {
                window.location.href = response.data.url;
            }
        } catch (error) {
            console.error("Failed to get Google redirect URL:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button 
            onClick={handleConnect} 
            disabled={loading}
            className="btn btn-outline-danger shadow-sm d-flex align-items-center gap-2"
        >
            {loading ? (
                <span className="spinner-border spinner-border-sm" role="status"></span>
            ) : (
                <>
                    <FaGoogle />
                    <span>Connect Google Ads</span>
                </>
            )}
        </button>
    );
}