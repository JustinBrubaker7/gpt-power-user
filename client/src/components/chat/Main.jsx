import React, { useState, useEffect, useRef } from 'react';
import SidebarShell from '../../layout/SidebarShell.jsx';
import { useAuth } from '../../context/auth-context.jsx';
import { establishWebSocketConnection } from '../../api/chat.js';

const models = [
    {
        name: 'GPT-3.5',
        modelId: 'gpt-3.5-turbo-1106',
    },
    {
        name: 'GPT-4',
        modelId: 'gpt-4-1106-preview',
    },
];

const Main = () => {
    const { currentUser } = useAuth();

    const ws = useRef(null);
    const endOfMessagesRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo-1106');

    const scrollToBottom = () => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    establishWebSocketConnection(ws, currentUser, newMessage, setMessages, selectedModel);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        let newMessages = [...messages, { content: newMessage, role: 'user' }];
        // Create a payload containing both the new message and the conversation history
        const payload = {
            settings: {
                model: selectedModel,
                temperature: 0.7, // Hardcoded temperature
            },
            messages: [...messages, { content: newMessage, role: 'user' }],
        };

        if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
            establishWebSocketConnection();
        } else {
            // Send the serialized payload as a JSON string
            ws.current.send(JSON.stringify(payload));
        }

        setMessages(newMessages);
        setNewMessage('');
    };

    const handleKeyDown = (event) => {
        if (event.keyCode === 13) {
            // Check if the Enter key is pressed
            handleSendMessage();
        }
    };

    return (
        <SidebarShell>
            <Header
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
                models={models}
                disabled={messages.length}
            />
            <div className='flex flex-col h-3/4 fixed bottom-10 w-2/3'>
                <MessageList
                    messages={messages}
                    endOfMessagesRef={endOfMessagesRef}
                    modelName={(models.find((model) => model.modelId === selectedModel) || {}).name}
                />
                <MessageInput
                    newMessage={newMessage}
                    setNewMessage={setNewMessage}
                    handleSendMessage={handleSendMessage}
                    handleKeyDown={handleKeyDown}
                />
            </div>
        </SidebarShell>
    );
};

const Header = ({ selectedModel, setSelectedModel, models, disabled }) => {
    return (
        <div className='flex text-white justify-between items-center border-b-2 border-gray-300 p-2 '>
            <h1 className='text-2xl text-white font-bold'>Chat</h1>
            <div className='flex items-center'>
                <select
                    value={selectedModel}
                    disabled={disabled}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className='border-none outline-none p-1 rounded w-24 bg-transparent text-white'
                >
                    {models.map((model) => (
                        <option className='text-black' key={model.modelId} value={model.modelId}>
                            {model.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

const MessageList = ({ messages, endOfMessagesRef, modelName }) => {
    return (
        <div className='flex-grow overflow-y-auto mb-2 p-2'>
            {messages.map((message, index) => (
                <div
                    key={index}
                    className={`text-white flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                    <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`flex flex-col p-2 min-w-36 rounded-lg `}>
                            <span
                                className={`text-xs text-gray-500  ${message.role === 'user' ? 'text-right' : 'text-left'}`}
                            >
                                <span className='inline-block h-6 w-6 overflow-hidden rounded-full bg-gray-100'>
                                    <svg className='h-full w-full text-gray-300' fill='currentColor' viewBox='0 0 24 24'>
                                        <path d='M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z' />
                                    </svg>
                                </span>{' '}
                                {message.role === 'user' ? 'You' : `${modelName}`}
                            </span>
                            <div className='text-md'>{formatMessage(message.content)}</div>
                        </div>
                    </div>
                </div>
            ))}
            <div ref={endOfMessagesRef} />
        </div>
    );
};

const MessageInput = ({ newMessage, setNewMessage, handleSendMessage, handleKeyDown }) => {
    return (
        <div className='flex'>
            <textarea
                type='text'
                placeholder='Type your message...'
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className='flex-grow mr-2 border border-gray-300 p-2'
            ></textarea>
            <button
                onClick={handleSendMessage}
                className='bg-yellow-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
            >
                Send
            </button>
        </div>
    );
};

const formatMessage = (message) => {
    return message.split('\n').map((line, index, array) => (
        <React.Fragment key={index}>
            {line}
            {index !== array.length - 1 && <br />}
        </React.Fragment>
    ));
};

export default Main;
