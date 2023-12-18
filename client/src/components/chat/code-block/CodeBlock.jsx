import React from 'react';
import './CodeBlock.css'; // Import your custom CSS

const CodeBlock = ({ code }) => {
    return (
        <pre className='code-block'>
            <code>{code}</code>
        </pre>
    );
};

export default CodeBlock;
