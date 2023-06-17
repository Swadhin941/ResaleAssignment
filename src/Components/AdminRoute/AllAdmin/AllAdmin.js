import React, { useContext, useEffect, useState } from 'react';
import { SharedData } from '../../SharedData/SharedContext';
import { useNavigate } from 'react-router-dom';
import RemoveAdmin from './RemoveAdmin';
import DeleteModal from '../../DeleteModal/DeleteModal';
import { toast } from 'react-hot-toast';

const AllAdmin = () => {
    const { user, logout } = useContext(SharedData);
    const navigate = useNavigate();
    const [allUser, setAllUser] = useState([]);
    const [deleteConfirm, setDeleteConfirm]= useState(false);
    const [deleteId, setDeleteId]= useState('');
    const [selectedAccount, setSelectedAccount]= useState('')
    const [reload, setReload]= useState(true);
    useEffect(() => {
        if (user) {
            fetch(`http://localhost:5000/userList?user=${user?.email}`, {
                method: "GET",
                headers: {
                    authorization: `bearer ${localStorage.getItem('token')}`
                }
            })
                .then(res => {
                    if (res.status === 401) {
                        logout();
                    }
                    if (res.status === 403) {
                        navigate('/forbidden');
                    }
                    return res.json();
                })
                .then(data => {
                    // console.log(data);
                    setAllUser(data);
                })
        }
    }, [user, reload])
    const handleAdmin= (email)=>{
        fetch(`http://localhost:5000/makeAdmin?user=${user?.email}`,{
            method: "PATCH",
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
            console.log(data);
            if(data.modifiedCount >=1){
                setReload(!reload);
            }
        })
    }
    useEffect(()=>{
        if(deleteConfirm){
            fetch(`http://localhost:5000/deleteUser?user=${user?.email}`,{
                method: "DELETE",
                headers:{
                    authorization: `bearer ${localStorage.getItem('token')}`,
                    'content-type': "application/json"
                },
                body: JSON.stringify({email: deleteId})
            })
            .then(res=>{
                if(res.status === 401){
                    logout()
                }
                if(res.status=== 403){
                    navigate('/forbidden');
                }
                return res.json();
            })
            .then(data=>{
                if(data.deletedCount >=1){
                    toast.success("Deleted successfully");
                    setDeleteConfirm(false);
                    setReload(!reload);
                }
            })
        }
    },[deleteConfirm])

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
                            {
                                allUser.map((item, index) => <tr key={item._id}>
                                    <td>{index + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.email}</td>
                                    <td>{item.role}</td>
                                    <td>{item.role !== 'admin' ? <button className='btn btn-success btn-sm' onClick={()=>handleAdmin(item.email)}>Make Admin</button>: <button className='btn btn-danger btn-sm' data-bs-target="#removeAdmin" data-bs-toggle="modal" onClick={()=>setSelectedAccount(item.email)}>Remove Admin</button>}</td>
                                    <td><button className='btn btn-danger btn-sm' data-bs-toggle="modal" data-bs-target="#deleteModal" onClick={()=>setDeleteId(item.email)}>Delete</button></td>
                                </tr>)
                            }                            
                        </tbody>
                    </table>
                    <RemoveAdmin email= {selectedAccount} reload={reload} setReload= {setReload}></RemoveAdmin>
                    <DeleteModal></DeleteModal>
                </div>
            </div>
        </div>
    );
};

export default AllAdmin;