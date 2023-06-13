import React from 'react';
import Navbar from '../Navbar/Navbar';
import { Link, Outlet } from 'react-router-dom';

const AdminLayout = () => {
    return (
        <div>
            <Navbar></Navbar>
            <Outlet></Outlet>

            <div className="alert alert-info d-none d-lg-block">Resize your browser to show the responsive offcanvas toggle.</div>

            <div className="offcanvas-sm offcanvas-start" tabIndex="-1" id="offcanvasResponsive" aria-labelledby="offcanvasResponsiveLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasResponsiveLabel">Responsive offcanvas</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#offcanvasResponsive" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    <p className="mb-0">This is content within an <code>.offcanvas-lg</code>.</p>
                    <Link to={'/dashboard/allSeller'}>All Seller</Link>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;