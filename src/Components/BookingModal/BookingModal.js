import React, { useContext, useState } from 'react';
import { SharedData } from '../SharedData/SharedContext';

const BookingModal = ({ detailsData, modalData }) => {
    const { user } = useContext(SharedData);
    const [locationError, setLocationError] = useState('');
    const meetingLocation = ['Sylhet', "Dhaka", "Dinajpur", 'Rajshahi', 'Pabna', "Barisal", "Khulna", "Faridpur", "Noakhali", "Mymensingh"];
    const handleSubmit = e => {
        e.preventDefault();
        const form = e.target;
        if (form.meetingLocation.value === 'default') {
            setLocationError("Please select a location");
            return;
        }
        setLocationError('');
        modalData({
            contact: form.contact.value,
            meetingLocation: form.meetingLocation.value
        });
        form.reset();
    }

    return (
        <div className='modal fade' id='bookingModal' data-bs-backdrop="static" data-bs-keyboard="false">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header border border-0">
                        <button className='btn btn-close' data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-body">
                        <div className="card border border-0 p-3">
                            <h4 className='text-center fw-bold mb-2'>Confirm information</h4>
                            <div className="card-body">
                                <form className='form' onSubmit={handleSubmit}>
                                    <div>
                                        <label htmlFor="itemName" className='mb-1'>Item name:</label>
                                        <div className="input-group">
                                            <input type="text" className='form-control' defaultValue={detailsData.modelName} readOnly style={{ backgroundColor: "#d6d6d6" }} />
                                        </div>
                                    </div>
                                    <div className='mt-2'>
                                        <label htmlFor="itemPrice" className='mb-1'>Item Price: </label>
                                        <div className="input-group">
                                            <input type="text" className='form-control' defaultValue={`$${detailsData.resalePrice}`} readOnly style={{ backgroundColor: "#d6d6d6" }} />
                                        </div>
                                    </div>
                                    <div className='mt-2'>
                                        <label htmlFor="userName" className='mb-1'>User Name: </label>
                                        <div className="input-group">
                                            <input type="text" className='form-control' defaultValue={user?.displayName} readOnly style={{ backgroundColor: "#d6d6d6" }} />
                                        </div>
                                    </div>
                                    <div className='mt-2'>
                                        <label htmlFor="userName" className='mb-1'>User Email: </label>
                                        <div className="input-group">
                                            <input type="text" className='form-control' defaultValue={user?.email} readOnly style={{ backgroundColor: "#d6d6d6" }} />
                                        </div>
                                    </div>
                                    <div className='mt-2'>
                                        <label htmlFor="contact" className='mb-1'>Contact number: </label>
                                        <div className="input-group">
                                            <input type="text" className='form-control' name='contact' id='contact' placeholder='Enter your contact number' />
                                        </div>
                                    </div>
                                    <div className='mt-2'>
                                        <label htmlFor="meetingLocation" className='mb-1'>Location:</label>
                                        <div className='input-group'>
                                            <select name="meetingLocation" id="meetingLocation" defaultValue={'default'} className='form-select'>
                                                <option value="default" disabled>---Select meeting location---</option>
                                                {
                                                    meetingLocation.map((item, index) => <option key={index} value={item}>{item}</option>)
                                                }
                                            </select>
                                        </div>
                                        <p className='text-danger'>{locationError}</p>
                                    </div>
                                    <div className='d-flex justify-content-center'>
                                        <button type='submit' className='btn btn-success' data-bs-dismiss="modal">Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;