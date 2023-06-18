import React, { useContext, useEffect, useState } from 'react';
import { SharedData } from '../../SharedData/SharedContext';
import { useNavigate } from 'react-router-dom';
import DeleteModal from '../../DeleteModal/DeleteModal';
import { toast } from 'react-hot-toast';

const AllSeller = () => {
    const [allSeller, setAllSeller] = useState([]);
    const { user, logout } = useContext(SharedData);
    const [reload, setReload] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        if (user) {
            fetch(`https://carresaleserver.vercel.app/sellerList?user=${user?.email}`, {
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

    }, [user, reload])
    useEffect(() => {
        if (deleteConfirm) {
            fetch(`https://carresaleserver.vercel.app/deleteUser?user=${user?.email}`, {
                method: "DELETE",
                headers: {
                    authorization: `bearer ${localStorage.getItem('token')}`,
                    'content-type': "application/json"
                },
                body: JSON.stringify({ email: deleteId })
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
                    if (data.deletedCount >= 1) {
                        toast.success("Deleted successfully");
                        setDeleteConfirm(false);
                        setReload(!reload);
                    }
                })
        }
    }, [deleteConfirm])

    const handleVerify = (email) => {
        console.log(email);
        fetch(`https://carresaleserver.vercel.app/verifySeller?user=${user?.email}`,{
            method: "PUT",
            headers:{
                authorization: `bearer ${localStorage.getItem('token')}`,
                "content-type": "application/json"
            },
            body: JSON.stringify({email: email})
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
            if(data.modifiedCount>=1){
                toast.success("Verify Status updated");
                setReload(!reload);
            }
        })
    }


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
                                allSeller.map((item, index) => <tr key={item._id}>
                                    <td>{index + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.email}</td>
                                    <td>
                                        {
                                            !item?.verified ? item?.verifyRequest ? <button className='btn btn-success btn-sm' onClick={() => handleVerify(item.email)}>Accept verify request</button> : <button className='btn btn-success btn-sm' onClick={() => handleVerify(item.email)}>Verify Account</button>: <button className='btn btn-success fw-bold btn-sm' disabled>Verified</button>
                                        }
                                    </td>
                                    <td>
                                        <button className='btn btn-danger btn-sm' data-bs-toggle="modal" data-bs-target="#deleteModal" onClick={() => setDeleteId(item.email)}>Delete</button>
                                    </td>
                                </tr>)
                            }
                        </tbody>
                    </table>
                    <DeleteModal deleteId={setDeleteId} deleteConfirm={setDeleteConfirm}></DeleteModal>
                </div>
            </div>
        </div>
    );
};

export default AllSeller;