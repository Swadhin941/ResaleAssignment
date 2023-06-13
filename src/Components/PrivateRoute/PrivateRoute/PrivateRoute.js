import React, { useContext } from 'react';
import { SharedData } from '../../SharedData/SharedContext';
import { ClipLoader } from "react-spinners/ClipLoader";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(SharedData);
    const location = useLocation();

    if (loading) {
        return <div className='d-flex justify-content-center'>Loading...</div>
    }
    if (user && user.uid) {
        return children;
    }

    return <Navigate to={'/login'} state={{ from: location }} replace></Navigate>
};

export default PrivateRoute;