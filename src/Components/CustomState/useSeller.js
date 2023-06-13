import React, { useEffect, useState } from 'react';

const useSeller = (email) => {
    const [seller, setSeller] = useState(false);
    const [sellerLoading, setSellerLoading]= useState(true);
    useEffect(() => {
        if (email) {           
            fetch(`http://localhost:5000/sellerCheck?user=${email}`)
                .then(res => res.json())
                .then(data => {
                    setSeller(data.isSeller);
                    setSellerLoading(false);
                })
                .catch(err=>{
                    setSellerLoading(false);
                })
        }

    }, [email])
    return [seller, sellerLoading];

};

export default useSeller;