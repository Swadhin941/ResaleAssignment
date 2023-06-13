import React, { useContext, useEffect, useState } from 'react';
import { SharedData } from '../../SharedData/SharedContext';
import { toast } from 'react-hot-toast';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { useNavigate } from 'react-router-dom';

const Advertise = () => {
    const [advertiseData, setAdvertiseData] = useState([]);
    const { user, logout } = useContext(SharedData);
    const [dataLoader, setDataLoader] = useState(false);
    const navigate = useNavigate();
    const handleClick = (data) => {
        navigate(`details/${data}`);
    }
    useEffect(() => {
        setDataLoader(true);
        fetch(`http://localhost:5000/advertise`)
            .then(res => res.json())
            .then(data => {
                setAdvertiseData(data);
                setDataLoader(false);
            })
            .catch(err => {
                toast.error("Check your internet connection or reload page");
                setDataLoader(false);
            })
    }, [])
    return (
        <div className='container-fluid p-2'>
            {
                advertiseData.length > 0 && (
                    <div className='row'>
                        <h2 className='fw-bold'>Hot Deals</h2>
                        <hr className='mb-3' />
                        <Carousel autoPlay={true}>
                            {
                                advertiseData.map(item => <div key={item._id}
                                    onClick={() => handleClick(item._id)}>
                                    <img src={item.carImg} alt='' className='img-fluid' />
                                </div>)
                            }
                        </Carousel>
                    </div>
                )
            }
        </div>
    );
};

export default Advertise;