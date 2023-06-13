import React, { useEffect, useState } from 'react';

const useToken = (email) => {
    const [token, setToken]= useState(false);
    useEffect(()=>{
        if(email){
            fetch(`http://localhost:5000/jwt?user=${email}`)
            .then(res=> res.json())
            .then(data=>{
                localStorage.setItem('token', data.token);
                setToken(true);
            })

        }
    })
    return [token];
};

export default useToken;