import React from "react";
import { useNavigate } from "react-router-dom";
import { getTokenInfo } from "../../utils/tokenUtils"; // Assuming this utility gives you token data
import { createPaymentOrder, verifyPayment } from "../../api"; // Import the new API functions
import "./SubscriptionPage.css";

const SubscriptionPage = () => {
    const navigate = useNavigate();
    const tokenInfo = getTokenInfo(); // Get token info
    const collegeId = tokenInfo ? tokenInfo.roleSpecificId : null; // Extract collegeId from token

    if (!collegeId) {
        // Handle the case where collegeId is not available, for example, redirect to an error page
        return <div>Error: Unable to retrieve college information.</div>;
    }

    const handleSubscribe = async () => {
        try {
            const amount = process.env.REACT_APP_PAYMENT_AMOUNT; // Amount in paise (₹999) from env variable
            const razorpayKey = process.env.REACT_APP_RAZORPAY_KEY; // Razorpay key from env variable

            if (!razorpayKey) {
                alert("Razorpay key is not set!");
                return;
            }

            // Call the API function to create the payment order
            const order = await createPaymentOrder(collegeId, amount);

            const options = {
                key: razorpayKey, // Razorpay Key from env variable
                amount: order.amount,
                currency: order.currency,
                order_id: order.id,
                name: "Premium Subscription",
                description: "Unlock exclusive features including Certificate Generation",
                handler: async (response) => {
                    try {
                        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;

                        // Use the verifyPayment API function
                        const verificationResponse = await verifyPayment(
                            razorpay_order_id, 
                            razorpay_payment_id, 
                            razorpay_signature
                        );

                        // Check the response from the verification API
                        if (verificationResponse.success) {
                            alert("Subscription successful! Welcome to Premium.");
                            navigate("/college/dashboard");
                        } else {
                            alert("Payment verification failed! Please try again.");
                        }
                    } catch (error) {
                        console.error("Payment verification failed:", error);
                        alert("Payment verification failed! Please try again.");
                    }
                },
                theme: {
                    color: "#3399cc",
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error("Error creating order:", error);
            alert("Error creating order! Please try again.");
        }
    };

    return (
        <div className="subscription-page">
            <h1>Choose Your Plan</h1>
            <div className="plans-container">
                {/* Normal Plan */}
                <div className="plan normal-plan">
                    <h2>Normal Plan</h2>
                    <p className="price">Free</p>
                    <ul>
                        <li>Student Management</li>
                        <li>Student Achievement Management</li>
                    </ul>
                    <button className="subscribe-button disabled" disabled>
                        Current Plan
                    </button>
                </div>

                {/* Premium Plan */}
                <div className="plan premium-plan">
                    <h2>Premium Plan</h2>
                    <p className="price">₹999/year</p>
                    <ul>
                        <li>Student Management</li>
                        <li>Student Achievement Management</li>
                        <li>Certificate Generation</li>
                    </ul>
                    <button className="subscribe-button" onClick={handleSubscribe}>
                        Upgrade to Premium
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPage;
