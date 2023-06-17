import React, { useContext } from 'react';
import { useLoaderData } from 'react-router-dom';
import { SharedData } from '../SharedData/SharedContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckOut from './CheckOut';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK);

const Payment = () => {
    const dataLoad = useLoaderData();
    const { user } = useContext(SharedData);
    console.log(dataLoad);
    return (
        <div className='container-fluid mt-4'>
            <div className="row">
                <div className="col-12 col-md-12 col-lg-12">
                    <div className="card border border-0">
                        <h6 className='fs-3'>Please pay ${dataLoad.itemPrice + ' '}to purchase {dataLoad.itemName}</h6>
                        <h2 className='fw-bold mt-3 text-center'>Your details</h2>
                        <div className="d-flex justify-content-center">
                            <div className="card">
                                <div className="card-body">
                                    <div>
                                        <label htmlFor="email" className='mb-1'>Email</label>
                                        <div className="input-group">
                                            <input type="email" className='form-control' defaultValue={user?.email} readOnly style={{ backgroundColor: "#b5b5b5" }} />
                                        </div>
                                    </div>
                                    <div className='mt-3'>
                                        <label htmlFor="contact" className='mb-1'>Phone Number</label>
                                        <div className='input-group'>
                                            <input type="text" className='form-control' defaultValue={dataLoad.contact} readOnly style={{ backgroundColor: "#b5b5b5" }} />
                                        </div>
                                    </div>
                                    <div className='mt-3'>
                                        <label htmlFor="location" className='mb-1'>Meeting Location:</label>
                                        <div className="input-group">
                                            <input type="text" className='form-control' defaultValue={dataLoad.meetingLocation} readOnly style={{ backgroundColor: "#b5b5b5" }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='mt-2 mb-3'>
                            <h2 className='text-center fw-bold mb-5'>Complete your payment via cards</h2>
                            <Elements stripe={stripePromise}>
                                <CheckOut dataLoad={dataLoad}></CheckOut>
                            </Elements>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;