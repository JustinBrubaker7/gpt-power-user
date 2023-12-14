import React, { useState } from 'react';
import { login } from '../api/auth';
import { useAuth } from '../context/auth-context';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { loginUserIn } = useAuth();
    const navigate = useNavigate();

    // const history = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const formData = {
            email: email,
            password: password,
        };
        console.log(formData);

        try {
            let successfulLogin = await login(formData);
            if (successfulLogin) {
                loginUserIn(successfulLogin);
                navigate('/');
            }

            console.log(successfulLogin);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 mt-24'>
                <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
                    <img
                        className='mx-auto h-10 w-auto'
                        src='https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500'
                        alt='Your Company'
                    />
                    <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white'>
                        Sign in to your account
                    </h2>
                </div>

                <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
                    <form className='space-y-6'>
                        <div>
                            <label htmlFor='email' className='block text-sm font-medium leading-6 text-white'>
                                Email address
                            </label>
                            <div className='mt-2'>
                                <input
                                    id='email'
                                    name='email'
                                    type='email'
                                    autoComplete='email'
                                    required
                                    className='block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <div className='flex items-center justify-between'>
                                <label htmlFor='password' className='block text-sm font-medium leading-6 text-white'>
                                    Password
                                </label>
                                {/* <div className='text-sm'>
                                    <a href='#' className='font-semibold text-indigo-400 hover:text-indigo-300'>
                                        Forgot password?
                                    </a>
                                </div> */}
                            </div>
                            <div className='mt-2'>
                                <input
                                    id='password'
                                    name='password'
                                    type='password'
                                    autoComplete='current-password'
                                    required
                                    className='block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type='submit'
                                onClick={handleLogin}
                                className='flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500'
                            >
                                Sign in
                            </button>
                        </div>
                    </form>

                    <p className='mt-10 text-center text-sm text-gray-400'>
                        Not a member?{' '}
                        <a href='/sign-up' className='font-semibold leading-6 text-indigo-400 hover:text-indigo-300'>
                            Start a 14 day free trial
                        </a>
                    </p>
                </div>
            </div>
        </>
    );
}
