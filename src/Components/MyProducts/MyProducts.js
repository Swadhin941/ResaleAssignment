import React, { useContext, useEffect, useState } from 'react';
import { SharedData } from '../SharedData/SharedContext';
import { Link, useNavigate } from 'react-router-dom';
import "./MyProduct.css"
import { toast } from 'react-hot-toast';
import DeleteModal from '../DeleteModal/DeleteModal';

const MyProducts = () => {
    const { user, logout, updateUserPhoto } = useContext(SharedData);
    const [myProducts, setMyProducts] = useState([]);
    const [userPhoto, setUserPhoto] = useState(null);
    const [reload, setReload] = useState(true);
    const [profileImageState, setProfileImageState] = useState(null);
    const [uploadedImageLink, setUploadedImageLink] = useState('');
    const [verifyStatus, setVerifyStatus] = useState([]);
    const [deleteConfirm, setDeleteConfirm]= useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        if (user) {
            fetch(`https://carresaleserver.vercel.app/my-products?user=${user?.email}`, {
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
                    setMyProducts(data);
                })
        }
    }, [reload])

    const handleAdvertise = (item) => {
        item.advertise = true;
        fetch(`https://carresaleserver.vercel.app/advertise?user=${user?.email}`, {
            method: "PUT",
            headers: {
                authorization: `bearer ${localStorage.getItem('token')}`,
                'content-type': "application/json",
            },
            body: JSON.stringify(item)
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
                if (data.modifiedCount >= 1) {
                    setReload(!reload);
                }
            })
    }
    useEffect(() => {
        if (user) {
            fetch(`https://carresaleserver.vercel.app/getUser?user=${user?.email}`, {
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
                    // console.log(data);
                    setUserPhoto(data);
                })
            fetch(`https://carresaleserver.vercel.app/verifyStatus?user=${user?.email}`, {
                method: "get",
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
                    setVerifyStatus(data);
                })

        }
    }, [reload])

    const handleImage = (e) => {
        // console.log(e.target.files[0]);
        setProfileImageState(URL.createObjectURL(e.target.files[0]));
    }
    const handlePhotoUpdateClick = () => {
        console.log(document.querySelector('.profileImageInput').files[0]);
        const profileImage = document.querySelector('.profileImageInput').files[0];
        const formData = new FormData();
        formData.append("image", profileImage);
        // console.log(formData);
        fetch(`https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_IMG_API}`, {
            method: "POST",
            body: formData
        })
            .then(res => res.json())
            .then(imgData => {
                console.log(imgData.data.url);
                setUploadedImageLink(imgData.data.url)
                fetch(`https://carresaleserver.vercel.app/user?user=${user?.email}`, {
                    method: "PUT",
                    headers: {
                        authorization: `bearer ${localStorage.getItem('token')}`,
                        "content-type": "application/json",
                    },
                    body: JSON.stringify({ name: userPhoto?.name, role: userPhoto?.role, email: userPhoto?.email, photoURL: imgData.data.url })
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
                    .then(imgDatabase => {
                        if (imgDatabase.modifiedCount >= 1) {
                            updateUserPhoto(uploadedImageLink)
                                .then(() => {
                                    toast.success("Uploaded Successfully");
                                    setProfileImageState(null);
                                })
                        }
                    })
            })

    };
    const handleVerifyAccount = () => {
        fetch(`https://carresaleserver.vercel.app/verifyRequest?user=${user?.email}`, {
            method: "POST",
            headers: {
                authorization: `bearer ${localStorage.getItem('token')}`,
                "content-type": "application/json",
            },
            body: JSON.stringify({ email: user?.email })
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
                if (data.acknowledged) {
                    setReload(!reload);
                }
            })
    }
    //Cancel verify request working from here
    useEffect(()=>{
        if(deleteConfirm){
            fetch(`https://carresaleserver.vercel.app/verifyStatus?user=${user?.email}`,{
                method: "DELETE",
                headers:{
                    authorization: `bearer ${localStorage.getItem('token')}`,
                    "content-type": "application/json",
                },
                body: JSON.stringify({email: user?.email})
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
                if(data.deletedCount>=1){
                    // console.log("verify request cancel", data);
                    setReload(!reload);
                    setDeleteConfirm(false);
                }
            })
        }
    },[deleteConfirm])

    return (
        <div className='container-fluid p-4 profileSection'>
            <div className="d-flex justify-content-center ">
                <div className="card border border-0 p-5">
                    <div className='profileDiv'>
                        <div className='profileImageDiv'>
                            <img src={userPhoto?.photoURL ? userPhoto?.photoURL : user?.photoURL} alt="" className='img-fluid profileImage' />
                        </div>
                        <div className='profileImageIcon' onClick={() => document.querySelector('.profileImageInput').click()}>
                            <i className="bi bi-camera-fill text-success fs-4" ></i>
                            <input type="file" name="profileImageInput" className='profileImageInput' onChange={handleImage} hidden />
                        </div>

                    </div>
                    <div className="profileNameDiv d-flex justify-content-center mt-2">
                        <h6 className='profileName fw-bold'>{user?.displayName}</h6>{userPhoto?.verified && <i className='bi bi-check-circle-fill text-primary ms-1 '></i>}
                    </div>
                    <div className='d-flex justify-content-center'>
                        {
                            !userPhoto?.verified && verifyStatus.length === 0 ? <button className='btn btn-outline-primary' onClick={handleVerifyAccount}>Verify your Account</button> : <button className='btn btn-outline-primary'  data-bs-target="#deleteModal" data-bs-toggle="modal">Cancel verify request</button>
                            
                        }
                        <DeleteModal deleteId={verifyStatus[0]?._id}  deleteConfirm= {setDeleteConfirm}></DeleteModal>
                    </div>
                </div>
            </div>
            <div className={profileImageState ? `uploadImageOn border rounded` : `uploadImageOff`}>
                <div className=' d-flex justify-content-center align-items-center my-4' style={{ height: "300px" }}>

                    <img src={profileImageState} alt="" className='img-fluid' style={{ height: "100%", width: "auto" }} />
                </div>
                <div className='d-flex justify-content-center'>
                    <button className='btn btn-success me-3' onClick={handlePhotoUpdateClick}>Upload</button>
                    <button className='btn btn-danger' onClick={() => setProfileImageState(null)}>Cancel</button>
                </div>
            </div>
            <div className="row mt-5 g-4">
                {
                    myProducts.map(item => <div key={item._id} className='col-12 col-md-12 col-lg-12'>
                        <div className="card border border-0">
                            <div className="card-body">
                                <div className='d-flex justify-content-between'>
                                    <div className='d-flex'>
                                        <div style={{ height: "50px", width: "50px" }}>
                                            <img src={item.carImg} alt="carImage" style={{ height: "100%", width: "100%", borderRadius: "50%" }} />
                                        </div>
                                        <div className='ms-2'>
                                            <Link to={`/details/${item._id}`} className='text-decoration-none d-block'>{item.modelName}</Link>
                                            {
                                                item?.paymentStatus ? <div className='pe-2 ps-2 fw-bold' style={{ display: "inline", border: "1px solid orange", borderRadius: "5px", backgroundColor: "#d6d6d6", color: "orange", fontSize: "10px" }}>
                                                    Sold
                                                </div> :
                                                    <div className='ps-2 pe-2 fw-bold' style={{ display: "inline", border: "1px solid green", borderRadius: "5px", backgroundColor: "#d6d6d6", color: "green", fontSize: "10px" }}>
                                                        Available
                                                    </div>
                                            }
                                            <p className="text-muted fw-bold" style={{ fontSize: "12px" }}>Price: ${item.resalePrice}</p>
                                        </div>
                                    </div>

                                    <div className=''>
                                        {
                                            !item?.paymentStatus ? item?.advertise ? <button className='btn btn-mixColor ' disabled>Advertised</button> : <button className='btn btn-mixColor text-white' onClick={() => handleAdvertise(item)}>Advertise</button>: ""
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>)
                }
            </div>
        </div>
    );
};

export default MyProducts;