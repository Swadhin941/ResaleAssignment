import React from 'react';
import { useLoaderData, useNavigate, useNavigation } from 'react-router-dom';
import "./SpecificBrand.css";

const SpecificBrand = () => {
    const specificBrand = useLoaderData();
    const navigate = useNavigate();
    const handleClick= (id)=>{  
        navigate(`/details/${id}`);
    }
    
    return (
        <div className='container-fluid p-4'>
            <div className="row g-2">
                {
                    specificBrand.map(item=><div className='col-12 col-md-6 col-lg-4' key={item._id}>
                        <div className="card">
                            <div className="cardImgTopDiv">
                                <img src={item.carImg} alt="" className='img-fluid cardImgTop' />
                            </div>
                            <div className="card-body">
                                <h4 className='card-title fw-bold'>{item.modelName}</h4>
                                <small className='text-muted d-block'> <p className='fw-bold d-inline'>Brand</p>: {item.brandName} </small>
                                <small className='text-muted d-block fw-bold'>Car condition: {item.status}</small>
                                <small className='text-muted d-block'>Location: {item.location}</small>
                                <small className='text-muted d-block'>Original Price: ${item.originalPrice}</small>
                                <h5 className='fs-3 text-success fw-bold'>Price: ${item.resalePrice}</h5>
                                <div className='d-flex justify-content-center'>
                                    <button className='btn btn-warning mt-2 fw-bold' onClick={()=>handleClick(item._id)}>View Details</button>
                                </div>
                            </div>
                        </div>
                    </div>)
                }
            </div>
        </div>
    );
};

export default SpecificBrand;