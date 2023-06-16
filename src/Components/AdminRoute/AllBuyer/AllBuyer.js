import React, { useContext, useEffect, useState } from 'react';
import { SharedData } from '../../SharedData/SharedContext';

const AllBuyer = () => {
    const [allBuyer, setAllBuyer]= useState([]);
    const {user, logout}= useContext(SharedData);
    useEffect(()=>{
        if(user?.email){
            fetch(`http://localhost:5000/`)
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

export default AllBuyer;