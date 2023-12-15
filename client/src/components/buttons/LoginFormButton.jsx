import React from 'react';

export default function LoginFormButton({ displayText, isLoading, handler }) {
    return (
        <>
            <button
                type='submit'
                onClick={handler}
                className='flex w-full justify-center rounded-md bg-teal-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-teal-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500'
                disabled={isLoading}
            >
                {isLoading ? (
                    <div className='flex items-center'>
                        <svg className='animate-spin h-5 w-5 mr-3' viewBox='0 0 24 24'>
                            <defs>
                                <linearGradient id='gradient' x1='0%' y1='0%' x2='100%' y2='100%'>
                                    <stop offset='0%' style={{ stopColor: '#4fd1c5', stopOpacity: 1 }} />
                                    <stop offset='100%' style={{ stopColor: '#319795', stopOpacity: 1 }} />
                                </linearGradient>
                            </defs>
                            <circle cx='12' cy='12' r='10' stroke='url(#gradient)' strokeWidth='4' />
                            <path
                                fill='url(#gradient)'
                                d='M14 2a10 10 0 000 20 10 10 0 100-20zm0 18a8 8 0 110-16 8 8 0 010 16z'
                            />
                        </svg>
                        <p>Loading ...</p>
                    </div>
                ) : (
                    <p>{displayText}</p>
                )}
            </button>
        </>
    );
}
