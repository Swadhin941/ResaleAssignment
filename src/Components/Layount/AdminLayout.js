import React, { useContext, useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { SharedData } from '../SharedData/SharedContext';

const AdminLayout = () => {
    const { user, logout } = useContext(SharedData);
    const [userInfo, setUserInfo]= useState(null);
    const navigate= useNavigate();
    useEffect(() => {
        if (user) {
            fetch(`http://localhost:5000/getUser?user=${user?.email}`, {
                method: "GET",
                headers:{
                    authorization: `bearer ${localStorage.getItem('token')}`
                }
            })
            .then(res=>{
                if(res.status===401){
                    logout()
                }
                if(res.status===403){
                    navigate('/forbidden');
                }
                return res.json();
            })
            .then(data=>{

                setUserInfo(data);
            })
        }

    }, [user])
    return (
        <div>
            <Navbar></Navbar>
            <div className="container-fluid p-5">
                <div className='d-flex justify-content-center'>
                    <div className="card border border-0 p-3">
                        <div className='d-flex justify-content-center'>
                            <div  style={{height:"100px", width: "100px", borderRadius:"50%", border:"1px solid transparent"}}>
                                <img src={userInfo?.photoURL} alt="" className='img-fluid' style={{borderRadius:"50%", height:"100%", width:"100%"}} />
                            </div>
                        </div>
                        <h6 className='text-center mb-0 mt-2' style={{fontWeight:"600"}}>{userInfo?.name}</h6>
                        <p className='text-center mt-0'  style={{fontWeight:"600"}}>({userInfo?.role})</p>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-12 col-md-12 col-lg-12">
                        <div className="card border border-0">
                            <ul className='nav nav-tabs'>
                                <li className='nav-item'>
                                    <Link className='nav-link ' to={'/dashboard'}>All Buyer</Link>
                                </li>
                                <li className='nav-item'>
                                    <NavLink className='nav-link ' to={'/dashboard/allSeller'}>All Seller</NavLink>
                                </li>
                                <li className='nav-item'>
                                    <NavLink className='nav-link ' to={'/dashboard/allAdmin'}>All Admin</NavLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-12 col-lg-12">
                        <div className="card p-2 border border-0">
                            <Outlet></Outlet>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;