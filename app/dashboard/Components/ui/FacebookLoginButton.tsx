
export default function ConnectFacebookButton() {
    const handleConnect = () => {
        // Point this to your Laravel backend URL
        const backendUrl = process.env.NEXT_PUBLIC_AUTH_URL;
        window.location.href = `${backendUrl}/facebook/redirect`;
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