import React from 'react';
import Banner from '../Banner/Banner';
import HomeCard from '../HomeCard/HomeCard';
import AllCategories from '../Brands/AllCategories';
import Advertise from '../Advertise/Advertise';

const Home = () => {

    return (
        <div className='container p-4'>
            <Banner></Banner>
            <HomeCard></HomeCard>
            <AllCategories></AllCategories>
            <Advertise></Advertise>
        </div>
    );
};

export default Home;