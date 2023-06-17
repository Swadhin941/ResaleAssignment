import React, { useContext, useEffect, useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { SharedData } from '../SharedData/SharedContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const CheckOut = ({dataLoad}) => {
    const {user, logout}= useContext(SharedData);
    const stripe = useStripe();
    const elements = useElements();
    const [cardError, setCardError] = useState('');
    const [clientSecret, setClientSecret]= useState('');
    const navigate= useNavigate();
    const bookingData= {
        itemPrice: dataLoad.itemPrice
    }
    useEffect(()=>{
        fetch(`http://localhost:5000/create-payment-intents?user=${user?.email}`,{
            method: "POST",
            headers:{
                authorization : `bearer ${localStorage.getItem("token")}`,
                "content-type": "application/json",
            },
            body: JSON.stringify({bookingData: bookingData})
        })
        .then(res=>{
            if(res.status=== 401){
                logout()
            }
            if(res.status=== 403){
                navigate('/forbidden');
            }
            return res.json();
        })
        .then(data=>{
            console.log(data);
            setClientSecret(data.clientSecret);
        })
    },[])
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) {
            return;
        }
        const card = elements.getElement(CardElement);
        if (card === 'null') {
            return;
        }
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card
        })
        if (error) {
            setCardError(error.message);
            return;
        }
        setCardError('');
        // console.log(paymentMethod);
        const {paymentIntent, error: cardConfirmError} = await stripe.confirmCardPayment(
            clientSecret,
            {
              payment_method: {
                card: card,
                billing_details: {
                  name: user?.displayName,
                  email: user?.email
                },
              },
            },
          );
        if(cardConfirmError){
            setCardError(cardConfirmError.message);
        }
        console.log(paymentIntent);
        if(paymentIntent.status==='succeeded'){
            fetch(`http://localhost:5000/payment?user=${user?.email}`,{
                method:"POST",
                headers:{
                    authorization: `bearer ${localStorage.getItem('token')}`,
                    'content-type': "application/json"
                },
                body: JSON.stringify({transactionId: paymentIntent.id,email: user?.email,itemName: dataLoad.itemName, itemImg: dataLoad.itemImg,itemId: dataLoad.itemId,itemPrice: dataLoad.itemPrice})
            })
            .then(res=>{
                if(res.status=== 401){
                    logout()
                }
                if(res.status=== 403){
                    navigate('/forbidden');
                }
                return res.json();
            })
            .then(data=>{
                if(data.acknowledged){
                    toast.success("Payment successfully completed");
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
            <div className='d-flex justify-content-center '>
                <button className='btn btn-success btn-sm' type="submit" disabled={!stripe || !clientSecret}>
                    Pay
                </button>
            </div>
            {cardError && <p className='text-danger'>{cardError}</p>}

        </form>
    );
};

export default CheckOut;