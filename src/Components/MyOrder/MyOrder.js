import React, { useContext, useEffect, useState } from 'react';
import { SharedData } from '../SharedData/SharedContext';
import { Link, useNavigate } from 'react-router-dom';
import { PhotoView, PhotoProvider } from "react-photo-view";
import useAdmin from '../CustomState/useAdmin';

const MyOrder = () => {
    const { user, logout } = useContext(SharedData);
    const [myOrder, setMyOrder] = useState([]);
    const navigate = useNavigate();
    const [isAdmin, adminLoading]= useAdmin(user?.email);
    useEffect(() => {
        if (user) {
            fetch(`http://localhost:5000/my-order?user=${user?.email}`, {
                method: "GET",
                headers: {
                    authorization: `bearer ${localStorage.getItem('token')}`
                }
            })
                .then(res => {
                    if (res.status === 401) {
                        logout()
                    }
                    if (res.status === 403) {
                        navigate('/forbidden');
                    }
                    return res.json()
                })
                .then(data => {
                    console.log(data);
                    setMyOrder(data);
                })
        }
    }, [user?.email])
    return (
        <div className='container-fluid'>
            <div className="row">
                <div className="col-12 col-md-12 col-lg-12">
                    <table className='table table-striped'>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Image</th>
                                <th>Title</th>
                                <th>Price</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                myOrder.map((item, index) => <tr key={item._id}>
                                    <td>{index + 1}</td>
                                    <td><div style={{ height: "30px", width: "30px" }}> <PhotoProvider><PhotoView src={item.itemImg}><img src={item.itemImg} className='img-fluid' alt="" style={{ height: "100%", width: "100%", borderRadius: "50%" }} /></PhotoView> </PhotoProvider> </div></td>
                                    <td><Link to={`/details/${item.itemId}`}>{item.itemName}</Link></td>
                                    <td>${item.itemPrice}</td>
                                    <td>{!item.paymentStatus ? <button className='btn btn-sm btn-success' onClick={()=>navigate(`/payment/${item._id}`)}>Pay</button>: <button className='btn btn-sm btn-warning' disabled>Sold</button>}</td>
                                </tr>)
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MyOrder;