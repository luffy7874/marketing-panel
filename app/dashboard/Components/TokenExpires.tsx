import { useRouter } from "next/navigation";

export default function TokenExpires(error: any) {
    const router = useRouter();
    return(
        <div className="alert alert-warning text-center mt-4 p-5 shadow-sm rounded">
            <h4 className="alert-heading mb-3">⚠️ Google Ads Disconnected</h4>
            <p className="mb-4">You do not have a valid token, or your connection has expired. Please generate a new one to view your metrics.</p>
            
            {/* Update this route to wherever your users connect their Google account */}
            <button 
                className="btn btn-primary" 
                onClick={() => router.push('/dashboard/token')} 
            >
                Reconnect Google Ads
            </button>

            <hr className="my-4" />
            <p className="mb-0 text-muted" style={{ fontSize: '12px', wordBreak: 'break-all' }}>
                Developer Details: {error}
            </p>
        </div>
    );
}