import React from 'react';
import "./Banner.css"

const Banner = () => {

    return (
        <div className='container-fluid'>
            <div className='bannerDiv'>
                <div className='bannerImgDiv '>
                    <img src="https://i.ibb.co/6WG4tVc/image-psd-1.png" alt="" className='img-fluid' />
                </div>
                <div className="bannerImgText">
                    <h2 >Find your match here</h2>
                </div>
            </div>

        </div>
    );
};

export default Banner;