import React, { useContext } from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';
import { SharedData } from '../SharedData/SharedContext';

const ErrorPage = () => {
    const error = useRouteError();
    const { logout } = useContext(SharedData);
    const navigate= useNavigate();
    const handleLogout=()=>{
        logout()
        navigate("/login");
    }
    return (
        <div className='container-fluid'>
            <div className="row">
                <div className="col-12 col-md-12 col-lg-12">
                    <h6>{error.message}</h6>
                    <p>Please <span className='text-primary text-decoration-underline' onClick={handleLogout} style={{cursor:"pointer"}}>logout</span> and login again</p>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;