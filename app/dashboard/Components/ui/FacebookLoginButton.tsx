
export default function ConnectFacebookButton() {
    const handleConnect = () => {
        // Point this to your Laravel backend URL
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        window.location.href = `${backendUrl}/api/facebook/redirect`;
    };

    return (
        <button 
            onClick={handleConnect} 
            className="btn btn-primary btn  -lg shadow-sm"
        >
            Connect Facebook Ads
        </button>
    );
}