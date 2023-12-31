import React, { useContext, useEffect, useState } from 'react';
import { SharedData } from '../../SharedData/SharedContext';
import { useNavigate } from 'react-router-dom';
import DeleteModal from '../../DeleteModal/DeleteModal';
import { toast } from 'react-hot-toast';

const AllBuyer = () => {
    const [allBuyer, setAllBuyer] = useState([]);
    const { user, logout } = useContext(SharedData);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    const [reload, setReload] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        if (user?.email) {
            fetch(`https://carresaleserver.vercel.app/buyerList?user=${user?.email}`, {
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
                    return res.json();
                })
                .then(data => {
                    setAllBuyer(data);
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
                            {
                                allBuyer.map((item, index) => <tr key={item._id}>
                                    <td>{index + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.email}</td>
                                    <td><button className='btn btn-danger btn-sm' data-bs-toggle="modal" data-bs-target="#deleteModal" onClick={() => setDeleteId(item.email)}>Delete</button></td>
                                </tr>)
                            }
                        </tbody>
                    </table>
                    <DeleteModal deleteConfirm={setDeleteConfirm}></DeleteModal>
                </div>
            </div>
        </div>
    );
};

export default AllBuyer;