import React, { useContext, useEffect, useState } from 'react';
import { SharedData } from '../../SharedData/SharedContext';
import "./AllCategories.css";
import { useNavigate } from "react-router-dom";

const AllCategories = () => {
    const [allBrand, setAllBrand] = useState([]);
    const { user } = useContext(SharedData);
    const navigate = useNavigate();
    useEffect(() => {
        fetch('http://localhost:5000/allCategory')
            .then(res => res.json())
            .then(data => {
                setAllBrand(data);
            });
    }, [])

    const handleClick = (data) => {
        navigate(`/allCategories/${data}`);
    };  

    return (
        <div className='mt-5 container-fluid'>
            <h2 style={{ fontWeight: "600", fontFamily: "sans-serif" }}>All Brands</h2>
            <hr />
            <div className="row g-2">
                {
                    allBrand.map(item => <div className='col-6 col-md-4 col-lg-2' key={item._id}>
                        <div className="card border border-0" style={{ cursor: "pointer" }} onClick={()=>handleClick(item.Brand)}>
                            <div className="card-body">
                                <div className="categoryImgDiv">
                                    <img src={item.brandPic} alt="" className='img-fluid categoryImg ' />
                                </div>
                                <h5 className='fw-bold text-center mt-2'>{item.Brand}</h5>
                            </div>
                        </div>
                    </div>)
                }
            </div>
        </div>
    );
};

export default AllCategories;