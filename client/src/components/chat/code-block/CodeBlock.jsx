import React, { useState } from 'react';
import { ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import './CodeBlock.css'; // Import your custom CSS
import Highlight from 'react-highlight';
import 'highlight.js/styles/monokai-sublime.css'; // Import your custom CSS

const CodeBlock = ({ code }) => {
    const [copyFeedback, setCopyFeedback] = useState('');

    // Extracting the first line as the language and the rest as code content
    const [languageLabel, ...codeLines] = code.split('\n');
    const codeContent = codeLines.join('\n');

    const copyToClipboard = () => {
        navigator.clipboard
            .writeText(codeContent)
            .then(() => {
                setCopyFeedback('Copied!');
                setTimeout(() => setCopyFeedback(''), 2000); // Feedback message disappears after 2 seconds
            })
            .catch((err) => console.error('Error copying text: ', err));
    };

    return (
        <div className={`code-block-container text-white ${languageLabel}`}>
            <div className='w-full flex justify-end p-3 bg-black rounded-t-xl text-white'>
                {copyFeedback && <span className='copy-feedback'>{copyFeedback}</span>}
                <button onClick={copyToClipboard} className='copy-button'>
                    <ClipboardDocumentCheckIcon className='h-6 w-6 text-white' />
                </button>
            </div>
            <Highlight className={`language-${languageLabel}`}>{codeContent}</Highlight>
        </div>
    );
};

export default CodeBlock;
