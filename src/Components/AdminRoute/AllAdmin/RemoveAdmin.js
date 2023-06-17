import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { SharedData } from '../../SharedData/SharedContext';

const RemoveAdmin = ({email, reload, setReload}) => {
    const accountType = ['buyer', 'seller'];
    const {user, logout}= useContext(SharedData);
    const [accountTypeError, setAccountTypeError] = useState('');
    const navigate= useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        const selectedType = e.target.accountType.value;
        if(selectedType==='default'){
            setAccountTypeError("Select a type first");
            return;
        }
        setAccountTypeError('');
        console.log(selectedType);
        fetch(`http://localhost:5000/removeAdmin?user=${user?.email}`,{
            method: 'PATCH',
            headers:{
                authorization: `bearer ${localStorage.getItem('token')}`,
                "content-type": "application/json"
            },
            body: JSON.stringify({email: email, role: selectedType})
        })
        .then(res=>{
            if(res.status=== 401){
                logout()
            }
            if(res.status=== 403){
                navigate("/forbidden");
            }
            return res.json();
        })
        .then(data=>{
            if(data.modifiedCount>=1){
                toast.success("Update Successfully");
                e.target.reset();
                setReload(!reload);
            }
        })
        

    }
    return (
        <div className={`modal fade `} id="removeAdmin"  data-bs-backdrop="static" data-bs-keyboard="false">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header border border-0">
                        <button className='btn btn-close' data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-body">
                        <h4 className='text-center fw-bold'>Set account type</h4>
                        <form className='form' onSubmit={handleSubmit}>
                            <div>
                                <select name="accountType" id="accountType" defaultValue={'default'} className='form-select' required>
                                    <option value="default" disabled>---Select a type---</option>
                                    {
                                        accountType.map((item, index) => <option key={index} value={item}>{item}</option>)
                                    }
                                </select>
                            </div>
                            {
                                accountTypeError &&  <p className='text-danger'>{accountTypeError}</p>
                            }
                            <div className='d-flex justify-content-center mt-2'>
                                <button className='btn btn-success'>Save</button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default RemoveAdmin;