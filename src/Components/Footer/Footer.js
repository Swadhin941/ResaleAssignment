import React from 'react';
import "./Footer.css";

const Footer = () => {
    const handleFacebookClick = () => {
        window.location.href = "https://www.facebook.com/";
    }
    const handleYoutubeClick = () => {
        window.location.href = "https://www.youtube.com/";
    }
    const handleLinkedinClick = () => {
        window.location.href = "https://bd.linkedin.com/";
    }
    return (
        <div className='container-fluid bg-dark footer'>
            <div className="row">
                <div className="col-12 col-md-6 col-lg-6">
                    <div className="card bg-dark border-0 p-4">
                        <div className="card-body ">
                            <p className='text-white'>Level-4, 34, Awal Centre, Banani, Dhaka</p>
                            <p className='text-white'>Support: swadhinghose@gmail.com</p>
                            <p className='text-white'>Contact: 01637908732</p>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6  col-lg-6">
                    <div className="card bg-dark border-0 p-4">
                        <div className="card-body ">
                            <p className='text-white text-center'>Follow Us</p>
                            <div className='d-flex justify-content-center'>
                                <button className='btn text-white' onClick={handleFacebookClick}><i className="bi bi-facebook fs-4"></i></button>
                                <button className='btn text-white' onClick={handleYoutubeClick}><i className="bi bi-youtube fs-4"></i></button>
                                <button className='btn text-white' onClick={handleLinkedinClick}><i className="bi bi-linkedin fs-4"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12 col-md-12 col-lg-12">
                    <h6 className='text-white text-center'><i className="bi bi-c-circle"></i>Copyright reserved by Swadhin Ghosh</h6>
                </div>
            </div>
        </div>
    );
};

export default Footer;