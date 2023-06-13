import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { SharedData } from '../SharedData/SharedContext';
import { toast } from "react-hot-toast";
import { useLocation, useNavigate } from 'react-router-dom';
import useToken from '../CustomState/useToken';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit } = useForm();
    const { login, user } = useContext(SharedData);
    const [token] = useToken(user?.email);
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';
    const navigate = useNavigate();
    useEffect(() => {
        if (token) {
            navigate(from, { replace: true });
        }
    }, [token])


    const handleForm = (data, e) => {
        login(data.email, data.password)
            .then((users) => {
                const user = users.user;
            })
            .catch(err=>{
                toast.error(err.message.split('/')[1].split(')')[0])
            })
    }
    return (
        <div className='container-fluid'>
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <div className="card p-2" style={{ backgroundColor: "#149777", color: "white" }}>
                    <div className="card-body">
                        <h2 className='fw-bold text-center'>Sign In</h2>
                        <form className='form mt-2' onSubmit={handleSubmit(handleForm)}>
                            <div>
                                <label htmlFor="email" className='mb-1'>Email:</label>
                                <div className="input-group">
                                    <span className='input-group-text'><i className='bi bi-envelope-at-fill'></i></span>
                                    <input type="email" name='email' id='email' className='form-control' {...register('email', { required: true })} placeholder='Enter your email address'/>
                                </div>
                            </div>
                            <div className='mt-2'>
                                <label htmlFor="password" className='mb-1'>Password:</label>
                                <div className="input-group">
                                    <span className='input-group-text'><i className='bi bi-key'></i></span>
                                    <input type={`${!showPassword ? "password" : "text"}`} className='form-control' name='password' id='password' style={{ borderRight: "none" }} {...register('password', { required: true })} placeholder='Enter your password' />
                                    <span className='input-group-text bg-white' onClick={() => setShowPassword(!showPassword)}><i className={`bi ${!showPassword ? "bi-eye-slash" : "bi-eye"}`}></i></span>
                                </div>
                            </div>
                            <div className='mt-3'>
                                <button type='submit' className='btn btn-dark w-100'>Login</button>
                            </div>
                            <div className='mt-3 d-flex justify-content-evenly'>
                                <hr className='w-100 text-white fw-bold' />
                                <p className='fs-4 me-1 ms-1'>OR</p>
                                <hr className='w-100 text-white' />
                            </div>
                        </form>
                        <button className='btn btn-outline-dark w-100'>Continue with Google</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;