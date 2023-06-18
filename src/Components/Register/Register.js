import React, { useContext, useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { SharedData } from '../SharedData/SharedContext';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import useToken from '../CustomState/useToken';
import ClockLoader from "react-spinners/ClockLoader";

const Register = () => {
    const [registerLoading, setRegisterLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { createUser, updateUserName, user, setUser, setErrorRegister } = useContext(SharedData);
    const navigate = useNavigate();
    const [registeredEmail, setRegisteredEmail] = useState('');
    const [token] = useToken(registeredEmail);
    useEffect(() => {
        if (token) {
            toast.success("User Created Successfully");
            navigate('/');
        }
    }, [token])

    const handleForm = (data) => {
        setRegisterLoading(true);
        setErrorRegister(true);
        createUser(data.email, data.password)
            .then(users => {
                updateUserName(data.fullName)
                    .then(() => {
                        fetch('https://carresaleserver.vercel.app/user', {
                            method: "POST",
                            headers: {
                                "content-type": "application/json",
                            },
                            body: JSON.stringify({ fullName: data.fullName, email: data.email, role: data.role })
                        })
                            .then(res => res.json())
                            .then(userPost => {
                                if (userPost.acknowledged) {
                                    setRegisteredEmail(data.email);
                                    setErrorRegister(false);
                                }

                            })

                    })
            })
            .catch(err => {
                toast.error(err.message.split('/')[1].split(')')[0]);
                setRegisterLoading(false);
            })
    }
    return (
        <div className='container-fluid'>

            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <div className="card p-2 " style={{ backgroundColor: "#149777", color: "white" }}>
                    <div className="card-body">
                        <h2 className='text-center fw-bold text-white'>Sign up</h2>
                        <form className='form mt-2' onSubmit={handleSubmit(handleForm)}>
                            <div>
                                <label htmlFor="fullName" className='mb-1'>Full Name:</label>
                                <div className="input-group">
                                    <span className='input-group-text'><i className='bi bi-person'></i></span>
                                    <input type="text" className='form-control' name='fullName' id='fullName' {...register('fullName', { required: true })} />
                                </div>
                            </div>
                            <div className='mt-2'>
                                <label htmlFor="email" className='mb-1'>Email :</label>
                                <div className="input-group">
                                    <span className='input-group-text'><i className='bi bi-envelope-at-fill'></i></span>
                                    <input type="email" className='form-control' name='email' id='email'{...register('email', { required: true })} />
                                </div>
                            </div>
                            <div className='mt-2'>
                                <label htmlFor="password" className='mb-1'>Password:</label>
                                <div className="input-group">
                                    <span className='input-group-text'><i className='bi bi-key'></i></span>
                                    <input type={`${!showPassword ? "password" : "text"}`} className='form-control' name='password' id='password' {...register('password', { required: true, pattern: { value: /(?=.*[0-9])(?=.*[A-Z])/, message: "Password should contains at least a uppercase letter and a number" }, minLength: { value: 6, message: "Password should 6 character longer" } })} style={{ borderRight: "none" }} />
                                    <span className='input-group-text' onClick={() => setShowPassword(!showPassword)} style={{ backgroundColor: "white" }}><i className={`bi ${!showPassword ? 'bi-eye-slash' : 'bi-eye'} `}></i></span>
                                </div>
                                {errors?.password && <small className='fw-bold' style={{ color: "white", fontSize: "10px" }}>{errors?.password.message}</small>}
                            </div>
                            <div className='mt-2'>
                                <label htmlFor="accountType" className='mb-1'>Account Type:</label>
                                <div className="input-group">
                                    <select name="accountType" className='form-select' id="accountType"{...register('role', { required: true })}>
                                        <option value="buyer">Buyer</option>
                                        <option value="seller">Seller</option>
                                    </select>
                                </div>
                            </div>
                            <div className='d-flex justify-content-center mt-3'>
                                <button type='submit' className='btn btn-light fw-bold d-flex justify-content-center w-50' disabled={registerLoading ? true : false}>{registerLoading ? <ClockLoader size={20} /> : "Sign up"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Register;