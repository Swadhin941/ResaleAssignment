import React, { useContext, useEffect, useState } from 'react';
import { SharedData } from '../../SharedData/SharedContext';
import { useNavigate } from 'react-router-dom';

const AllSeller = () => {
    const [allSeller, setAllSeller] = useState([]);
    const { user, logout } = useContext(SharedData);
    const navigate = useNavigate();
    useEffect(() => {
        if (user) {
            fetch(`http://localhost:5000/sellerList?user=${user?.email}`, {
                method: "GET",
                headers: {
                    authorization: `bearer ${localStorage.getItem('token')}`
                },
            })
                .then(res => {
                    if (res.status === 401) {
                        logout()
                    }
                    if (res.status === 403) {
                        navigate('/forbidden');
                    }
                    return res.json();
                })
                .then(data => {
                    console.log(data);
                    setAllSeller(data);
                })
        }

    }, [user])
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
                                <th>Verify Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                allSeller.map((item, index)=><tr key={item._id}>
                                    <td>{index+1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.email}</td>
                                    <td>
                                        {
                                            !item?.verified && item?.verifyRequest ? <button className='btn btn-success btn-sm'>Accept verify request</button>: <button className='btn btn-success btn-sm'>Verify Account</button>
                                        }
                                    </td>
                                    <td>
                                        <button className='btn btn-danger btn-sm'>Delete</button>
                                    </td>
                                </tr>)
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AllSeller;