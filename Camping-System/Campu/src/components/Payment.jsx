import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Payment() {
    const location = useLocation();
    const { formData, camp, totalPrice } = location.state || {};

    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [succeeded, setSucceeded] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setProcessing(true);

        try {
            // Fetch client secret from the backend
            const response = await fetch('http://localhost:3001/payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: totalPrice * 100 }), // Amount in cents
            });

            const { clientSecret } = await response.json();

            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: 'Customer Name', // Add actual customer name if available
                    },
                },
            });

            if (error) {
                setError(error.message);
                setProcessing(false);
            } else {
                setError(null);
                setProcessing(false);
                setSucceeded(true);
                navigate('/ConfirmationDetails', { state: { formData, camp, totalPrice, paymentIntent } });
            }
        } catch (error) {
            setError('An error occurred during payment processing.');
            setProcessing(false);
        }
    };

    return (
        <Dialog defaultOpen>
            <DialogTrigger asChild>
                <Button variant="outline">Checkout</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                    <DialogTitle>Checkout</DialogTitle>
                    <DialogDescription>Please enter your payment details to complete the purchase.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <CardElement className="p-4 border border-gray-300 rounded" />
                    {error && <div className="text-red-500">{error}</div>}
                    <DialogFooter>
                        <div className="flex items-center justify-between w-full">
                            <div className="text-lg font-bold">Total: RM {totalPrice}</div>
                            <Button type="submit" disabled={processing || succeeded}>
                                {processing ? "Processing..." : "Pay"}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
