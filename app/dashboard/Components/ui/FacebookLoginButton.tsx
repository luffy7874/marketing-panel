'use client';
import axios from '@/app/libs/axios';
 // Use YOUR configured axios instance
import { useState } from 'react';

export default function ConnectFacebookButton() {
    const [loading, setLoading] = useState(false);

    const handleConnect = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/facebook/redirect');

            if (response.data.url) {
                window.location.href = response.data.url;
            }
        } catch (error) {
            console.error("Failed to get redirect URL:", error);
            alert("Please login again to connect Facebook.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button 
            onClick={handleConnect} 
            disabled={loading}
            className="btn btn-primary shadow-sm"
        >
            {loading ? (
                <span className="loading loading-spinner"></span>
            ) : (
                "Connect Facebook Ads"
            )}
        </button>
    );
}