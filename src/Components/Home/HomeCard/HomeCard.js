import React, { useEffect, useState } from 'react';

const HomeCard = () => {
    const [premiumBrand, setPremiumBrand] = useState(0);
    const [registeredUser, setRegisteredUser] = useState(0);
    const [happyUser, setHappyUser] = useState(0);
    useEffect(() => {
        let value;
        if (premiumBrand !== 7) {
            value = setInterval(() => {
                setPremiumBrand(premiumBrand + 1);
            }, 1000)
        }
        return () => clearInterval(value);
    }, [premiumBrand])

    useEffect(() => {
        let value;
        if (registeredUser !== 400) {
            value = setInterval(() => {
                setRegisteredUser(registeredUser + 1);
            }, 1)
        }
        return () => clearInterval(value);
    }, [registeredUser])

    useEffect(() => {
        let value;
        if (happyUser !== 300) {
            value = setInterval(() => {
                setHappyUser(happyUser + 1);
            }, 2)
        }
        return () => clearInterval(value);
    }, [happyUser])

    return (
        <div className='container-fluid mt-4'>
            <div className="row g-2">
                <div className="col-12 col-md-6 col-lg-4">
                    <div className="card">
                        <div className="card-body">
                            <h1 className='text-center text-warning'>{premiumBrand}+</h1>
                            <h4 className='text-center text-success'>Premium Brands</h4>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <div className="card">
                        <div className="card-body">
                            <h1 className='text-center text-warning'>{registeredUser}+</h1>
                            <h4 className='text-center text-success'>Authentic User</h4>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <div className="card">
                        <div className="card-body">
                            <h1 className='text-center text-warning'>{happyUser}+</h1>
                            <h4 className='text-center text-success'>Happy User</h4>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default HomeCard;