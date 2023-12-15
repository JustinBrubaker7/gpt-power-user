import React, { useState } from 'react';
import { register } from '../api/auth';
import WhiteLogo from '../assets/white_transparent.png';
import LoginFormButton from '../components/buttons/LoginFormButton';
import { useNavigate } from 'react-router-dom';
import { validateEmail } from '../utils/formHandlers';

export default function SignUp() {
    const PASSWORD_LENGTH = 8;
    const USERNAME_LENGTH = 3;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        let error = false;

        if (!validateEmail(email)) {
            setError((prev) => ({ ...prev, email: 'Please enter a valid email address' }));
            setIsLoading(false);
            error = true;
        }

        if (password.length < PASSWORD_LENGTH) {
            setError((prev) => ({ ...prev, password: 'Password must be at least 8 characters long' }));
            setIsLoading(false);
            error = true;
        }

        if (username.length < USERNAME_LENGTH) {
            setError((prev) => ({ ...prev, username: 'Username must be at least 3 characters long' }));
            setIsLoading(false);
            error = true;
        }

        if (error) return null;

        const formData = {
            email: email,
            password: password,
            username: username,
        };
        console.log(formData);

        try {
            await register(formData);
            navigate('/login');
        } catch (error) {
            console.log(error);
        }
        setIsLoading(false);
    };

    return (
        <>
            <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 mt-24'>
                <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
                    <img className='mx-auto h-36 w-auto' src={WhiteLogo} alt='Your Company' />
                    <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white'>
                        Sign up for an account
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
                                    className='block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-teal-500 sm:text-sm sm:leading-6'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            {error?.email ? (
                                <p className='mt-1 text-sm text-red-500 h-4'>{error?.email}</p>
                            ) : (
                                <p className='mt-1 text-sm text-transparent h-4'></p>
                            )}
                        </div>
                        <div className='-mt-3'>
                            <label htmlFor='username' className='block text-sm font-medium leading-6 text-white'>
                                User Name
                            </label>
                            <div className='mt-2'>
                                <input
                                    id='username'
                                    name='username'
                                    type='username'
                                    autoComplete='username'
                                    required
                                    className='px-3 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-teal-500 sm:text-sm sm:leading-6'
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            {error?.username ? (
                                <p className='mt-1 text-sm text-red-500 h-4'>{error?.username}</p>
                            ) : (
                                <p className='mt-1 text-sm text-transparent h-4'></p>
                            )}
                        </div>
                        <div>
                            <div className='flex items-center justify-between'>
                                <label htmlFor='password' className='block text-sm font-medium leading-6 text-white'>
                                    Password
                                </label>
                            </div>
                            <div className='mt-2'>
                                <input
                                    id='password'
                                    name='password'
                                    type='password'
                                    autoComplete='current-password'
                                    required
                                    className='block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-teal-500 sm:text-sm sm:leading-6'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            {error?.password ? (
                                <p className='mt-1 text-sm text-red-500 h-4'>{error?.password}</p>
                            ) : (
                                <p className='mt-1 text-sm text-transparent h-4'></p>
                            )}
                        </div>

                        <div>
                            <LoginFormButton displayText={'Sign in'} handler={handleLogin} isLoading={isLoading} />
                        </div>
                    </form>

                    <p className='mt-10 text-center text-sm text-gray-400'>
                        Already have an account?{' '}
                        <a href='/login' className=' leading-6 text-teal-400 hover:text-teal-300'>
                            Login
                        </a>
                    </p>
                </div>
            </div>
        </>
    );
}
