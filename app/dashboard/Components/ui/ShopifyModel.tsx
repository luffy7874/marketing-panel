"use client"
import axios from '@/app/libs/axios';
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';

export default function ShopifyModal(props: any){
    const [shop, setShop] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setError(""); // Clear previous errors

        // Basic validation
        if (!shop.trim()) {
            setError("Please enter a valid Shopify store URL.");
            return;
        }

        setLoading(true);

        try {
            // Clean the URL just in case the client pastes "https://"
            const cleanShopUrl = shop.replace(/^https?:\/\//, '').trim();

            const response = await axios.post('/api/shopify-auth', {
                shop: cleanShopUrl
            });

            // If Laravel successfully returns the installation URL, redirect the user!
            if (response.data && response.data.url) {
                window.location.href = response.data.url; 
            } else {
                setError("Failed to generate the installation link.");
            }
        } catch (err: any) {
            // Catch server errors or invalid domains
            setError(err.response?.data?.error || "An error occurred while connecting. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return(
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Connect Shopify Store
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="labelInput" className="form-label">Shop URL</label>
                        <input 
                            type="text"
                            className={`form-control ${error ? 'is-invalid' : ''}`}
                            value={shop}
                            onChange={(e) => {
                                setShop(e.target.value);
                                setError(""); // Clear error when user types
                            }}
                            placeholder='e.g., your-store.myshopify.com'
                            disabled={loading}
                        />
                        
                        {/* Display error message if something fails */}
                        {error && <div className="invalid-feedback text-danger mt-1">{error}</div>}

                        <button 
                            className='btn btn-primary float-end mt-3' 
                            type='submit'
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Connecting...
                                </>
                            ) : (
                                'Connect Store'
                            )}
                        </button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );
}