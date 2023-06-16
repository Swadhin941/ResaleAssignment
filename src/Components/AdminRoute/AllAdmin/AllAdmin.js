import React, { useContext, useEffect, useState } from 'react';
import { SharedData } from '../../SharedData/SharedContext';
import { useNavigate } from 'react-router-dom';

const AllAdmin = () => {
    const {user, logout}= useContext(SharedData);
    const navigate = useNavigate();
    const [allUser, setAllUser]= useState([]);
    useEffect(()=>{
        if(user){
            fetch(`http://localhost:5000/userList?user=${user?.email}`,{
                method: "GET",
                headers:{
                    authorization: `bearer ${localStorage.getItem('token')}`
                }
            })
            .then(res=>{
                if(res.status=== 401){
                    logout();
                }
                if(res.status=== 403){
                    navigate('/forbidden');
                }
                return res.json();
            })
            .then(data=>{
                console.log(data);
            })
        }
    },[user])
    return (
        <div className='container-fluid'>
            <div className="row">
                <div className="col-12 col-md-12 col-lg-12">
                    <table className='table table-striped'>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Current Status</th>
                                <th>Admin Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AllAdmin;