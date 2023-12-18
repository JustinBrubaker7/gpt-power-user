import React from 'react';
import { useAuth } from '../context/auth-context.jsx';
import Main from '../components/chat/Main.jsx';

export default function Home() {
    const { logout } = useAuth();
    return (
        <div>
            <Main />
        </div>
    );
}

{
    /* <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 mt-24'>
    {' '}
    <p className='text-white h-full flex justify-center mt-48 text-3xl'> Home </p>
    <button
        className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow w-36 mx-auto'
        onClick={() => {
            logout();
        }}
    >
        Logout
    </button>
</div>; */
}
