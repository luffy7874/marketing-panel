"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/app/libs/axios";

export default function LogoutButton() {
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        
        try {
            await axios.post('/api/logout');

            document.cookie = "is_logged_in=; Max-Age=0; path=/";

            router.push('/auth/login');
        } catch (error) {
            console.error("Failed to log out", error);
            setIsLoggingOut(false);
        }
    };

    return (
        
        <button 
            onClick={handleLogout} 
            disabled={isLoggingOut}
            className="dropdown-item border-0 bg-none align-middle" // Or whatever Bootstrap classes match your UI
        >
            <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>
            {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
    );
}