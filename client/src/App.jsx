import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './utils/PrivateRoute';
import LoginPage from './pages/Login';
import SignUpPage from './pages/SignUp';
import HomePage from './pages/Home';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/login' element={<LoginPage />} />
                <Route path='/sign-up' element={<SignUpPage />} />
                <Route
                    path='/'
                    element={
                        <PrivateRoute>
                            <HomePage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path='/test'
                    element={
                        <PrivateRoute>
                            <p> Hello World </p>
                        </PrivateRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
