import React, { useState, useEffect, useContext } from 'react';

const AuthContext = React.createContext({
    isLoggedIn: false,
    id: '',

    loginUserIn: () => {},
    logout: () => {},
    signUp: () => {},
    getUser: () => {},
    updateCurrentUser: () => {},
});

export function useAuth() {
    return useContext(AuthContext);
}

export const AuthContextProvider = (props) => {
    const [currentUser, setCurrentUser] = useState(false);
    const [loading, setLoading] = useState(true);

    function updateCurrentUser(newUser) {
        const now = new Date();

        setCurrentUser(newUser, now);
        localStorage.setItem('date', now);
        updateUserLocalStorage(newUser);
    }

    function logout() {
        setCurrentUser(false);
        localStorage.clear();
        return;
    }

    function updateUserLocalStorage(data) {
        localStorage.setItem('Id', data.Id);
        localStorage.setItem('Email', data.Email);
    }

    function loginUserIn(data) {
        console.log(data);
        try {
            setCurrentUser({ ...data });

            const now = new Date();
            // let expirationDate;
            // if (remembered) {
            //     expirationDate = new Date(now.getTime() + 999900000);
            // } else {
            //     expirationDate = new Date(now.getTime() + 15770000000);
            // }

            updateUserLocalStorage(data, now);
            return;
        } catch (error) {}
    }

    function signUp(email, password) {
        return;
    }

    function forgotPassword(email) {
        return;
    }

    useEffect(() => {
        setLoading(true);

        const storedId = localStorage.getItem('Id');
        const storedEmail = localStorage.getItem('Email');

        const now = new Date();
        if (storedId) {
            setCurrentUser({
                Id: storedId,
                Email: storedEmail,
            });
        }
        setLoading(false);
    }, []);

    const contextValue = {
        currentUser,
        setCurrentUser,
        forgotPassword,
        loginUserIn: loginUserIn,
        logout: logout,
        signUp: signUp,
        updateCurrentUser: updateCurrentUser,
    };

    return <AuthContext.Provider value={contextValue}>{!loading && props.children}</AuthContext.Provider>;
};

export default AuthContext;
