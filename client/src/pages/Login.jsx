import React, { useState } from 'react';
import { login } from '../api/auth';
import { useAuth } from '../context/auth-context';
import { useNavigate } from 'react-router-dom';
import WhiteLogo from '../assets/white_transparent.png';
import LoginFormButton from '../components/buttons/LoginFormButton';
import { validateEmail } from '../utils/formHandlers';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const { loginUserIn } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!validateEmail(email)) {
            setError((prev) => ({ ...prev, email: 'Please enter a valid email address' }));
            setIsLoading(false);
            return;
        }

        const formData = {
            email: email,
            password: password,
        };
        console.log(formData);

        try {
            let successfulLogin = await login(formData);
            console.log(successfulLogin);
            if (successfulLogin.error) {
                setError((prev) => ({ ...prev, login: successfulLogin.error }));
                setIsLoading(false);
                return;
            }

            loginUserIn(successfulLogin);
            navigate('/');

            console.log(successfulLogin);
        } catch (error) {
            console.log(error);
        }
        setIsLoading(false);
    };

    return (
        <>
            <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 '>
                <div className='sm:mx-auto sm:w-full sm:max-w-sm mt-24'>
                    <img className='mx-auto h-36 w-auto' src={WhiteLogo} alt='Your Company' />
                    <h2 className='mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-white'>
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
                                    onBlur={() => setError(null)}
                                    onInput={() => setError(null)}
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

                        <div>
                            <div className='flex items-center justify-between -mt-3'>
                                <label htmlFor='password' className='block text-sm font-medium leading-6 text-white'>
                                    Password
                                </label>
                                {/* <div className='text-sm'>
                                    <a href='#' className='font-semibold text-teal-400 hover:text-teal-300'>
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
                                    onBlur={() => setError(null)}
                                    className='block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-teal-500 sm:text-sm sm:leading-6'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>{error?.login && <p className='mt-1 text-sm text-red-500 h-4'>{error?.login}</p>}</div>
                        <div>
                            <LoginFormButton displayText={'Login'} handler={handleLogin} isLoading={isLoading} />
                        </div>
                    </form>

                    <p className='mt-10 text-center text-sm text-gray-400'>
                        Not a member?{' '}
                        <a href='/sign-up' className=' leading-6 text-teal-400 hover:text-teal-300'>
                            Register here
                        </a>
                    </p>
                </div>
            </div>
        </>
    );
}
