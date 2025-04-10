import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ShopContext } from "../context/ShopContext";

const Verify = () => {
    const { setCartItem, token, backendUrl } = useContext(ShopContext);
    const [search] = useSearchParams();
    const navigate = useNavigate();

    const [processing, setProcessing] = useState(false);

    // Stripe parameters
    const success = search.get('success');
    const stripeOrderId = search.get('orderId');

    // Paystack parameters
    const reference = search.get('reference');
    const paystackOrderId = search.get('orderId');

    const verifyStripePayment = async () => {
        try {
            const response = await axios.post(
                `${backendUrl}/api/order/verifyStripe`,
                {
                    success,
                    orderId: stripeOrderId,
                    userId: JSON.parse(localStorage.getItem('user'))._id
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data?.message === "Payment Successfull") {
                setCartItem({});
                toast.success("Stripe payment verified successfully!");
                window.location.href = '/orders';
            } else {
                toast.error(response.data.message || "Stripe payment verification failed");
                navigate('/cart', { replace: true });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Stripe verification failed");
            console.error("Stripe error:", error);
            navigate('/cart', { replace: true });
        }
    };

    const verifyPaystackPayment = async () => {
        try {
            const response = await axios.post(
                `${backendUrl}/api/order/verifyPaystack`,
                {
                    reference,
                    orderId: paystackOrderId,
                    userId: JSON.parse(localStorage.getItem('user'))._id
                },
                { headers: { token } }
            );
    
            if (response.data?.success) {
                setCartItem({});
                toast.success("Payment verified successfully!");
                navigate('/orders', { replace: true });
            } else {
                toast.error(response.data.message || "Payment verification failed");
                navigate('/cart', { replace: true });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Verification failed");
            navigate('/cart', { replace: true });
        }
    };

    const verifyPayment = async () => {
        setProcessing(true);

        if (!token) {
            navigate('/login');
            return;
        }

        if (!reference || !paystackOrderId) {
            toast.error("Missing required parameters for Paystack payment verification");
            navigate('/');
            return;
        }

        if (success && stripeOrderId) {
            await verifyStripePayment();
        } else if (reference && paystackOrderId) {
            await verifyPaystackPayment();
        } else {
            toast.error("Invalid payment verification request.");
            navigate('/');
        }

        setProcessing(false);
    };

    useEffect(() => {
        verifyPayment();
    }, [token]);

    return (
        processing ? (
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-2xl font-bold">Verifying...</h1>
                <p>Please wait while we verify your payment.</p>
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="mx-auto justify-center flex flex-col items-center  border-t-2 border-b-2 border-blue-500 animate-spin h-10 w-32 rounded-full"></div>
                <p className="text-2xl text-green-400 mt-4">Payment successful</p>
            </div>
        )
    );
};

export default Verify;
