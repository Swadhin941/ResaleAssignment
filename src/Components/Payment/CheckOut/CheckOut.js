import React, { useContext, useEffect, useState } from 'react';
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { SharedData } from '../../SharedData/SharedContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const CheckOut = ({ bookingData }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState('');
    const [cardError, setCardError] = useState('');
    const { logout, user } = useContext(SharedData);
    const navigate= useNavigate();

    useEffect(() => {
        fetch(`http://localhost:5000/create-payment-intents`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                authorization: `bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ bookingData: bookingData })
        })
            .then(res => {
                if (res.status === 401) {
                    logout()
                }
                return res.json();
            })
            .then(data => {
                console.log(data);
                setClientSecret(data.clientSecret);
            })
    }, [])
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) {
            return;
        }

        const card = elements.getElement(CardElement);

        if (card === null) {
            return;
        }

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card
        })

        if (error) {
            // console.log(error.message);
            setCardError(error.message);
            return;
        }
        else {
            setCardError('');
            // console.log(paymentMethod);
        }
        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
            clientSecret,
            {
                payment_method: {
                    card: card,
                    billing_details: {
                        email: bookingData.email,
                        name: user?.displayName
                    },
                },
            },
        );

        if (confirmError) {
            setCardError(confirmError.message);
            return;
        }
        setCardError('');
        console.log(paymentIntent);
        if(paymentIntent.status==='succeeded'){
            fetch(`http://localhost:5000/payment`,{
                method:"POST",
                headers:{
                    "content-type": "application/json",
                    authorization: `bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({transactionId: paymentIntent.id, email: user?.email,itemName: bookingData.itemName, itemImg: bookingData.itemImg, itemId: bookingData.itemId, itemPrice: bookingData.itemPrice})
            })
            .then(res=> {
                if(res.status===401){
                    logout()
                }
                if(res.status=== 403){
                    navigate('/forbidden');
                }
                return res.json()
            })
            .then(data=>{
                if(data.acknowledged){
                    toast.success("Your payment request is successful");
                    navigate(-1);
                }
            })

            
            
        }

    }
    return (
        <form onSubmit={handleSubmit}>
            <CardElement
                options={{
                    style: {
                        base: {
                            fontSize: '16px',
                            color: '#424770',
                            '::placeholder': {
                                color: '#aab7c4',
                            },
                        },
                        invalid: {
                            color: '#9e2146',
                        },
                    },
                }}
            />
            <div className='d-flex justify-content-center'>
                <button type="submit" disabled={!stripe || !clientSecret} className='btn btn-sm btn-success mt-3'>
                    Pay
                </button>
            </div>

            <p className='text-danger'>{cardError}</p>
        </form>
    );
};

export default CheckOut;