import React, { useContext } from 'react';
import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";
import { SharedData } from '../SharedData/SharedContext';
import useSeller from '../CustomState/useSeller';

const Navbar = () => {
    const { user, logout } = useContext(SharedData);
    const [seller, sellerLoading] = useSeller(user?.email);
    const handleLogout = () => {
        logout()
    }
    return (
        <nav className="navbar navbar-expand-lg backgroundColorNav">
            <div className="container-fluid">
                <Link to={'/'} className='navbar-brand text-white fw-bolder'>Gari Dekhun</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse navFlex" id="navbarNavDropdown">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <NavLink to={'/'} className={'nav-link text-white fw-bold'}>Home</NavLink>
                        </li>
                        {
                            seller && <li className="nav-item">
                                <NavLink to={'/addCar'} className={'nav-link text-white fw-bold'}>Add Car</NavLink>
                            </li>
                        }

                        <li className="nav-item">
                            <NavLink to={'/dashboard'} className="nav-link d-lg-block fw-bold text-white mb-0"  >Dashboard</NavLink>
                            <p className="nav-link mt-0 d-lg-none fw-bold text-white" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasResponsive" aria-controls="offcanvasResponsive" style={{ cursor: "pointer" }}>Dashboard options</p>
                        </li>
                        {
                            user?.uid ?
                                <>

                                    <li className="nav-item">
                                        <NavLink className="nav-link text-white fw-bold" to={'/my-order'}>My orders</NavLink>
                                    </li>
                                    {
                                        seller && <li className="nav-item">
                                            <NavLink className="nav-link text-white fw-bold" to={'/my-products'}>My Products</NavLink>
                                        </li>
                                    }
                                    <li className="nav-item">
                                        <p style={{ cursor: "pointer" }} onClick={handleLogout} className={'nav-link text-white fw-bold'}>Logout</p>
                                    </li>

                                </> :
                                <>
                                    <li className="nav-item">
                                        <NavLink className="nav-link text-white fw-bold" to={'/login'}>Login</NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink className="nav-link text-white fw-bold" to={'/register'}>Register</NavLink>
                                    </li>
                                </>
                        }


                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;