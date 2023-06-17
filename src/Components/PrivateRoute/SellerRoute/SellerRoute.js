import React, { useContext, useEffect } from 'react';
import { SharedData } from '../../SharedData/SharedContext';
import { Navigate, useLocation } from 'react-router-dom';
import useSeller from '../../CustomState/useSeller';

const SellerRoute = ({children}) => {
    const {user, loading, logout}= useContext(SharedData);
    const location= useLocation();
    const [seller, sellerLoading]= useSeller(user?.email);
    if(loading || sellerLoading){
        return <div className='text-center fs-1 fw-bold'>Loading...</div>
    }
    if(user && user?.uid && seller){
        return children;
    }
    return <Navigate to={'/login'} state={{from: location}} replace></Navigate>
};

export default SellerRoute;