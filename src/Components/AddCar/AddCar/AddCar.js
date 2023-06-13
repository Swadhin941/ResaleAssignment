import React, { useContext, useEffect, useState } from 'react';
import { SharedData } from '../../SharedData/SharedContext';
import { useNavigate } from 'react-router-dom';
import { format } from "date-fns";
import "./AddCar.css";
import { toast } from 'react-hot-toast';
import useSeller from '../../CustomState/useSeller';

const AddCar = () => {
    const [brandName, setBrandName] = useState([]);
    const { user, logout } = useContext(SharedData);
    const [uploadImage, setUploadImage] = useState(null);
    // const [seller, sellerLoading]= useSeller(user?.email);
    //Some Form Errors state

    const [statusError, setStatusError] = useState('');
    const [locationError, setLocationError] = useState('');
    const [brandError, setBrandError] = useState('');
    const [imgError, setImgError] = useState('');
    const navigate = useNavigate();
    const carLocation = ['Sylhet', "Dhaka", "Dinajpur", 'Rajshahi', 'Pabna', "Barisal", "Khulna", "Faridpur", "Noakhali", "Mymensingh"];
    const carStatus = ["Excellent", "Good", "Fair"];
    useEffect(() => {
        fetch('http://localhost:5000/brandName', {
            method: 'get',
            headers: {
                authorization: `bearer ${localStorage.getItem('token')}`,
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
                setBrandName(data);
            })
    },[])

    const handleChange = (e) => {
        const type = e.target.files[0].type.split('/')[1];

        if (type === 'jpg' || type === 'png' || type === 'jpeg') {
            setImgError('');
            setUploadImage(URL.createObjectURL(e.target.files[0]));
        }
        else {
            setImgError('Image must be in jpg, jpeg or png format');
            return;
        }

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;

        if (form.brandName.value === 'default') {
            setBrandError('Please select a brand');
            return;
        }
        setBrandError('');
        if (form.location.value === 'default') {
            setLocationError('Please select a location');
            return;
        }
        setLocationError('');
        if (form.carStatus.value === 'default') {
            setStatusError("Please select car condition");
            return;
        }
        setStatusError('');
        if (!uploadImage) {
            setImgError("Please select a image");
            return;
        }
        setImgError('');
        console.log(form);
        console.log(form.uploadPicture.files);
        const uploadPicture = form.uploadPicture.files[0];
        const formData = new FormData();
        formData.append('image', uploadPicture);
        fetch(`https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_IMG_API}`, {
            method: "POST",
            body: formData
        })
            .then(res => res.json())
            .then(imgData => {
                if (imgData.success) {
                    const modelName = e.target.modelName.value;
                    const brandName = e.target.brandName.value;
                    const carStatus = e.target.carStatus.value;
                    const location = e.target.location.value;
                    const yearsOfUse = parseInt(e.target.yearsOfUse.value);
                    const originalPrice = parseInt(e.target.originalPrice.value);
                    const resalePrice = parseInt(e.target.resalePrice.value);
                    const description = e.target.description.value;
                    const carImg = imgData.data.url;
                    const seller = user?.email;
                    const contact = parseInt(e.target.contact.value);
                    const time = Date.now();
                    const date = format(new Date(), "PP");
                    fetch(`http://localhost:5000/brandUpload?user=${user?.email}`, {
                        method: "POST",
                        headers: {
                            authorization: `bearer ${localStorage.getItem('token')}`,
                            "content-type": "application/json"
                        },
                        body: JSON.stringify({ modelName, brandName, status: carStatus, location, originalPrice, resalePrice, yearsOfUse, phoneNumber: contact, seller, carImg, description, date, time })
                    })
                    .then(res=>{
                        if(res.status=== 401){
                            logout()
                        }
                        if(res.status===403){
                            navigate('/forbidden');
                        }
                        return res.json();
                    })
                    .then(data=>{
                        if(data.acknowledged){
                            toast.success('Uploaded new post');
                            form.reset();
                            navigate('/my-products');
                        }
                    })
                }
            })

    }

    return (
        <div className='container-fluid'>
            <div className="row">
                <div className="col-12 col-md-12 col-lg-12">
                    <h4 className='fw-bold text-center mb-3'>Car Information</h4>
                    <form className='form' onSubmit={handleSubmit}>
                        <div className="card">
                            <div className="card-body">
                                <div>
                                    <label htmlFor="modelName" className='mb-1'>Model Name:</label>
                                    <div className="input-group">
                                        <input type="text" className='form-control' name='modelName' id='modelName' placeholder='Model Name' required />
                                    </div>
                                </div>
                                <div className='mt-2'>
                                    <label htmlFor="brandName" className='mb-1'>Brand Name:</label>
                                    <div className='input-group'>
                                        <select name="brandName" id="brandName" defaultValue={'default'} className='form-select' >
                                            <option value="default" disabled>---Select available brand---</option>
                                            {
                                                brandName.map((item, index) => <option key={index} value={item.Brand}>{item.Brand}</option>)
                                            }
                                        </select>
                                    </div>
                                    <p className='text-danger'>{brandError}</p>
                                </div>
                                <div className='mt-2'>
                                    <label htmlFor="location" className='mb-1'>Location:</label>
                                    <div className='input-group'>
                                        <select name="location" id="location" defaultValue={'default'} className='form-select' required>
                                            <option value="default" disabled>---Select location---</option>
                                            {
                                                carLocation.map((item, index) => <option key={index} value={item}>{item}</option>)
                                            }
                                        </select>
                                    </div>
                                    <p className='text-danger'>{locationError}</p>
                                </div>
                                <div className='mt-2'>
                                    <label htmlFor="carStatus" className='mb-1'>Car Status :</label>
                                    <div className='input-group'>
                                        <select name="carStatus" id="carStatus" defaultValue={'default'} className='form-select' required>
                                            <option value="default">---Select condition of your vehicle---</option>
                                            {
                                                carStatus.map((item, index) => <option key={index} value={item}>{item}</option>)
                                            }
                                        </select>
                                    </div>
                                    <p className='text-danger'>{statusError}</p>
                                </div>
                                <div className='mt-2'>
                                    <label htmlFor="yearsOfUse" className='mb-1'>Years Of Use:</label>
                                    <div className="input-group">
                                        <input type="text" className='form-control' name='yearsOfUse' id='yearsOfUse' placeholder='Years of use' required />
                                    </div>
                                </div>
                                <div className='mt-2'>
                                    <label htmlFor="originalPrice" className='mb-1'>Original price:</label>
                                    <div className="input-group">
                                        <input type="text" className='form-control' name='originalPrice' id="originalPrice" placeholder='Market Price' required />
                                    </div>
                                </div>
                                <div className='mt-2'>
                                    <label htmlFor="resalePrice" className='mb-1'>Resale price:</label>
                                    <div className="input-group">
                                        <input type="text" className='form-control' name='resalePrice' id='resalePrice' placeholder='Resale Price' required />
                                    </div>
                                </div>
                                <div className='mt-2'>
                                    <label htmlFor="description" className='mb-1'>Description:</label>
                                    <div className="input-group">
                                        <textarea name="description" id="description" cols="30" rows="10" style={{ resize: "none" }} className='form-control' placeholder='Write something about your vehicle' required></textarea>
                                    </div>
                                </div>
                                <div className='mt-2'>
                                    <label htmlFor="uploadImage" className='mb-1 fw-bold'>Upload a image</label>
                                    <div className='d-flex justify-content-center'>
                                        <div className="input-group upload-image d-flex justify-content-center align-items-center" onClick={() => document.querySelector('.uploadPicture').click()}>
                                            <input type="file" name='uploadPicture' id="uploadPicture" className='uploadPicture ' hidden onChange={handleChange} />
                                            {
                                                uploadImage ?
                                                    <img src={uploadImage} height={'180'} width={'180'} alt="" />
                                                    : <div><i className="bi bi-cloud-arrow-up-fill fs-1 text-primary"></i></div>
                                            }
                                        </div>
                                    </div>
                                    <p className='text-danger text-center'>{imgError}</p>
                                </div>
                                <hr />
                                <h4 className='fw-bold text-center mt-3'>User Information</h4>
                                <div className='mt-2'>
                                    <label htmlFor="email" className='mb-1'>Email:</label>
                                    <div className="input-group">
                                        {
                                            user?.email && (
                                                <input type="email" className='form-control' defaultValue={user?.email} readOnly style={{ backgroundColor: "#dbdbdb" }} />
                                            )
                                        }
                                    </div>
                                </div>
                                <div className='mt-2'>
                                    <label htmlFor="contact" className='mb-1'>Contact Number:</label>
                                    <div className="input-group">
                                        <input type="text" className='form-control' name='contact' id='contact' placeholder='Enter your contact number' required />
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className='d-flex justify-content-center mt-2'>
                            <button type='submit' className='btn btn-success w-25 fw-bold'>Send</button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
};

export default AddCar;