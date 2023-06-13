import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React from 'react';
import { useLoaderData } from 'react-router-dom';
import CheckOut from '../CheckOut/CheckOut';

const stripePromise= loadStripe(process.env.REACT_APP_STRIPE_PK);
console.log(stripePromise);

const Payment = () => {
    const bookingData= useLoaderData();
    console.log(bookingData);

    return (
        <div className='container-fluid'>
            <div className="row">
                <div className="col-12 col-md-12 col-lg-12">
                    <div className="card border border-0">
                        <h2>Payment for {bookingData.itemName}</h2>
                        <h6>Please pay ${bookingData.itemPrice} for purchasing it.</h6>
                        <Elements stripe={stripePromise}>
                            <CheckOut bookingData={bookingData}></CheckOut>
                        </Elements>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;