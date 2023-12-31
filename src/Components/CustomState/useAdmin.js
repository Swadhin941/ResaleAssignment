import React, { useEffect, useState } from 'react';

const useAdmin = (email) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminLoading, setAdminLoading] = useState(true);
    useEffect(() => {
        if (email) {
            fetch(`https://carresaleserver.vercel.app/checkAdmin?user=${email}`)
                .then(res => res.json())
                .then(data => {
                    setIsAdmin(data.isAdmin);
                    setAdminLoading(false);
                })
                .catch(err => {
                    setAdminLoading(false);
                })
        }
    }, [email])
    return [isAdmin, adminLoading];
};

export default useAdmin;