"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/app/libs/axios";
import { useAuth } from "@/app/context/AuthContext";

export default function LogoutButton() {
    const router = useRouter();
    const { logout } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        
        try {
            await axios.post('/api/logout');
        } catch (error) {
            console.error("Server-side logout failed, clearing local session anyway.", error);
        } finally {
            logout();

            router.replace('/auth/login');
            
            setIsLoggingOut(false);
        }
    };

    return (
        <button 
            onClick={handleLogout} 
            disabled={isLoggingOut}
            className="dropdown-item border-0 bg-transparent align-middle"
        >
            <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>
            <span className="align-middle">
                {isLoggingOut ? "Logging out..." : "Logout"}
            </span>
        </button>
    );
}