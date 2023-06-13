import React, { useContext, useEffect, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import "./DetailsPage.css";
import BookingModal from '../BookingModal/BookingModal';
import { SharedData } from '../SharedData/SharedContext';
import { toast } from 'react-hot-toast';
import ClockLoader from 'react-spinners/ClockLoader';
import DeleteModal from '../DeleteModal/DeleteModal';

const DetailsPage = () => {
    const detailsData = useLoaderData();
    const { user, logout } = useContext(SharedData);
    const [modalData, setModalData] = useState(null);
    const [reload, setReload] = useState(false);
    const [bookingState, setBookingState] = useState(false);
    const [bookingButton, setBookingButton] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const navigate = useNavigate();
    console.log(detailsData);
    useEffect(() => {
        if (modalData) {
            setBookingButton(true);
            fetch(`http://localhost:5000/booking`, {
                method: "POST",
                headers: {
                    authorization: `bearer ${localStorage.getItem('token')}`,
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    itemId: detailsData._id,
                    itemName: detailsData.modelName,
                    itemBrand: detailsData.brandName,
                    email: user?.email,
                    meetingLocation: modalData?.meetingLocation,
                    contact: modalData?.contact,
                    itemPrice: detailsData.resalePrice,
                    itemImg: detailsData.carImg
                })
            })
                .then(res => {
                    if (res.status === 401) {
                        logout()
                    }
                    if (res.status === 403) {
                        navigate('/login');
                    }
                    return res.json();
                })
                .then(bookingsData => {

                    if (bookingsData.acknowledged) {
                        setModalData(null);
                        setReload(!reload);
                        toast.success("Booked Successfully");
                    }
                })
        }
    }, [modalData])
    useEffect(() => {
        if (user) {
            fetch(`http://localhost:5000/bookingCheck?user=${user?.email}&&item=${detailsData._id}`, {
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
                    if (data.booked) {
                        setBookingState(true);
                        setBookingButton(false);
                    }
                    else {
                        setBookingState(false);
                        setBookingButton(false);
                    }

                })
        }
    }, [reload])
    useEffect(() => {
        if (deleteConfirm && user?.email !== detailsData.seller) {
            fetch(`http://localhost:5000/deleteBooking?user=${user?.email}`, {
                method: 'DELETE',
                headers: {
                    authorization: `bearer ${localStorage.getItem('token')}`,
                    'content-type': "application/json",
                },
                body: JSON.stringify({ id: detailsData._id })
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
                        setReload(!reload);
                    }
                })
        }
        if (deleteConfirm && user?.email === detailsData.seller) {
            fetch(`http://localhost:5000/deleteProduct?user=${user?.email}`, {
                method: "DELETE",
                headers: {
                    authorization: `bearer ${localStorage.getItem('token')}`,
                    "content-type": "application/json",
                },
                body: JSON.stringify({ id: detailsData._id })
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
                        toast.success("Deleted Successfully");
                        setReload(!reload);
                        navigate(-1);
                    }
                })
                .catch(err => {
                    toast.error(err.message)
                })
        }
    }, [deleteConfirm])

    return (
        <div className='container-fluid p-3'>
            <div className="row">
                <div className="col-12 col-sm-12 col-md-12 col-lg-12">
                    <div className="detailsImgTop">
                        <img src={detailsData.carImg} alt="" className='img-fluid detailsImg' />
                    </div>
                </div>
                <div className="col-12 col-md-12 col-lg-12">
                    <div className="card">
                        <div className="card-body">
                            <h2 className='text-center fw-bold'>Car Specification</h2>
                            <h4 className='fw-bolder'>Model Name: {detailsData.modelName}</h4>
                            <p className='text-primary mb-0' style={{ fontWeight: "600" }}>Posted by {detailsData.seller === user?.email ? "You" : detailsData.sellerName} {detailsData.verified && <i className="bi bi-check-circle-fill text-primary" title='verified seller'></i>}</p>
                            <p className='mt-0' style={{ fontWeight: "600" }}>on {detailsData.date}</p>
                            <h6 style={{ fontWeight: "600" }}>Brand Name: {detailsData.brandName}</h6>
                            <h6 style={{ fontWeight: "600" }}>Location: {detailsData.location}</h6>
                            <h6 className='mt-0' style={{ fontWeight: "600" }}>Car Condition: {detailsData.status}</h6>
                            <h6 className='mt-0' style={{ fontWeight: "600" }}>Years of use: {detailsData.yearsOfUse} year</h6>
                            <h6 className='mt-0' style={{ fontWeight: "600" }}>Original Price: ${detailsData.originalPrice}</h6>
                            <h6 className='mt-0 w-50 fw-bold' >Description: {detailsData.description}</h6>
                            <h2 className='mt-0 text-danger fw-bold'>Price: ${detailsData.resalePrice}</h2>
                            {
                                user?.email === detailsData.seller ? <button className='btn btn-danger' data-bs-target="#deleteModal" data-bs-toggle="modal">Delete</button> :
                                detailsData.paymentStatus ? <button className='btn btn-secondary fw-bold' disabled>Sold</button> : !bookingState ? <button className='btn btn-success d-flex justify-content-center' data-bs-toggle="modal" data-bs-target="#bookingModal" disabled={bookingButton} style={{ width: "15%" }}>{bookingButton ? <ClockLoader color='white' size={25} /> : "Book Now"}</button> :
                                    <><button className='btn btn-danger fw-bold' data-bs-toggle="modal" data-bs-target="#deleteModal">Cancel Booking</button></>
                            }

                            <BookingModal modalData={setModalData} detailsData={detailsData}></BookingModal>
                            <DeleteModal deleteId={detailsData._id} deleteConfirm={setDeleteConfirm}></DeleteModal>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailsPage;