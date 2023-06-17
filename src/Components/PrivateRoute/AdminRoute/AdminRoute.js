import React, { useContext } from 'react';
import { SharedData } from '../../SharedData/SharedContext';
import useAdmin from '../../CustomState/useAdmin';
import { Navigate, useLocation } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const { user, loading } = useContext(SharedData);
    const [isAdmin, adminLoading] = useAdmin(user?.email);
    const location = useLocation();
    if (loading || adminLoading) {
        return <div className='text-center fs-1'>Loading...</div>
    }
    
    if (user && user?.uid && isAdmin) {
        return children;
    }
    return <Navigate to={'/login'} state={{ from: location }} replace></Navigate>;

};

export default AdminRoute;