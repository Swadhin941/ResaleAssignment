import React, { createContext, useEffect, useState } from 'react';
import app from '../Firebase/Firebase';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";

export const SharedData = createContext();

const SharedContext = ({ children }) => {
    const auth = getAuth(app);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorRegister, setErrorRegister] = useState(false);

    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const login = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    }

    const updateUserName = (userName) => {
        setLoading(true);
        return updateProfile(auth.currentUser, {
            displayName: userName,
        })
    }
    const updateUserPhoto= (photoURL)=>{
        setLoading(true);
        return updateProfile(auth.currentUser,{
            photoURL: photoURL,
        })
    }

    const logout = () => {
        setLoading(true);
        localStorage.removeItem('token');
        return signOut(auth);
    }

    useEffect(() => {
        const check = onAuthStateChanged(auth, currentUser => {
            if (!errorRegister) {
                setUser(currentUser);
                setLoading(false);
                console.log(currentUser);
            }

        })
        return () => check();
    })

    const authInfo = { user, loading, createUser, login, logout, updateUserName, setUser, setErrorRegister, setLoading, updateUserPhoto };
    return (
        <div>
            <SharedData.Provider value={authInfo}>
                {children}
            </SharedData.Provider>
        </div>
    );
};

export default SharedContext;