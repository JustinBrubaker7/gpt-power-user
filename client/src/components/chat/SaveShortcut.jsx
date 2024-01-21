import React, { useState } from 'react';
import { createShortCut } from '../../api/shortcut';
import { useAuth } from '../../context/auth-context';

export default function SaveShortcut() {
    const { currentUser } = useAuth();
    const [title, setTitle] = useState('');
    const [snippet, setSnippet] = useState('');

    const handleSave = async (event) => {
        event.preventDefault();
        try {
            await createShortCut(currentUser, {
                name: title,
                text: snippet,
                userId: currentUser.userId,
            });
            // Reset form or show success message
            setTitle('');
            setSnippet('');
        } catch (error) {
            // Handle error
            console.error('Error saving snippet:', error);
        }
    };

    return (
        <div className='bg-gray-100 p-4 rounded-lg shadow mt-4'>
            <h2 className='text-md font-normal mb-4'>Add a shortcut</h2>
            <form onSubmit={handleSave}>
                <input
                    type='text'
                    name='title'
                    id='title'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className='block w-full rounded-sm border-0 py-1.5 mb-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6 hover:bg-gray-50'
                    placeholder='Title'
                />

                <textarea
                    rows={4}
                    name='snippet'
                    id='snippet'
                    value={snippet}
                    onChange={(e) => setSnippet(e.target.value)}
                    placeholder='Enter shortcut text here...'
                    className='block w-full rounded-sm border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6 hover:bg-gray-50'
                />
                <p className='text-xs text-gray-500 mt-1'>
                    Add a new shortcut for faster prompting. To use the shortcut enter a "/" in the prompt box.
                </p>
                <div className='flex justify-end mt-4'>
                    <button
                        type='submit'
                        className='px-3 py-2 text-white bg-blue-700 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600'
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}
