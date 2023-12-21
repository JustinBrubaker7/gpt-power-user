import React, { useState, useEffect, useRef, useCallback } from 'react';
import SidebarShell from '../../layout/SidebarShell.jsx';
import { useAuth } from '../../context/auth-context.jsx';
import { useLocation } from 'react-router-dom';
import { establishWebSocketConnection, fetchChatById } from '../../api/chat.js';
import CodeBlock from './code-block/CodeBlock.jsx';

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
    const [chatId, setChatId] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Added
    const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo-1106');
    const [settings, setSettings] = useState({
        model: selectedModel,
        temperature: 0.7, // Hardcoded temperature
        conversationType: messages.length ? 'continue' : 'new',
        userId: currentUser.userId,
    });

    const location = useLocation();

    useEffect(() => {
        // see if the windoe is /chat/:chatId
        const chatIdFromUrl = window.location.pathname.split('/').pop();

        console.log('chatIdFromUrl', chatIdFromUrl);

        if (chatIdFromUrl) {
            fetchChatById(chatIdFromUrl, currentUser).then((chat) => {
                console.log('chat', chat);
                setChatId(chatIdFromUrl);
                setMessages(JSON.parse(chat.messages));
                console.log('chat.messages', JSON.parse(chat.messages));
                setSelectedModel(chat.model);
                setIsLoading(false);
            });

            console.log('chatIdFromUrl', chatIdFromUrl);
        } else {
            setIsLoading(false);
            setChatId(null);
            setMessages([]);
        }
    }, [location]);

    const scrollToBottom = () => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    establishWebSocketConnection(ws, currentUser, newMessage, setMessages, selectedModel, setSettings);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Only establish the connection when the component mounts
        establishWebSocketConnection(ws, currentUser, newMessage, setMessages, selectedModel, setSettings);
    }, []); // Empty dependency array to run only once

    const handleSendMessage = useCallback(() => {
        if (!newMessage.trim()) return;

        let newMessages = [...messages, { content: newMessage, role: 'user' }];
        // Create a payload containing both the new message and the conversation history
        const payload = {
            settings: {
                model: selectedModel,
                temperature: 0.7, // Hardcoded temperature
                conversationType: messages.length ? 'continue' : 'new',
                userId: currentUser.userId,
                id: settings.id,
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
    }, [newMessage, messages, ws.current, selectedModel, currentUser.userId]); // Dependencies

    const handleKeyDown = (event) => {
        if (event.keyCode === 13 && !event.shiftKey) {
            // Check if the Enter key is pressed without the Shift key
            console.log('Enter key pressed without Shift');
            handleSendMessage();
        } else if (event.keyCode === 13 && event.shiftKey) {
            // If Shift is also held down, do not submit
            console.log('Enter key pressed with Shift, not submitting');
        }
    };

    if (isLoading)
        return (
            <div className='flex justify-center items-center h-screen '>
                <h1 className='text-white text-3xl'>Loading...</h1>
            </div>
        );

    return (
        <SidebarShell>
            <Header
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
                models={models}
                disabled={messages.length}
            />
            <div className='flex flex-col h-3/4 fixed bottom-10 w-5/6'>
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
        <div className='flex text-white justify-between items-center border-b-2 border-gray-300  '>
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

const MessageList = React.memo(({ messages, endOfMessagesRef, modelName }) => {
    return (
        <div className='flex-grow overflow-y-auto mb-2 p-2 mx-auto w-5/6'>
            {messages.map((message, index) => (
                <div
                    key={index}
                    className={`text-white flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                    <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`flex flex-col p-2 min-w-36 rounded-lg `}>
                            <span
                                className={`text-xs text-gray-500  ${message.role === 'user' ? 'text-left' : 'text-left'}`}
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
});

const MessageInput = ({ newMessage, setNewMessage, handleSendMessage, handleKeyDown }) => {
    const [rows, setRows] = useState(1);

    const handleChange = (e) => {
        setNewMessage(e.target.value);
        updateRows(e.target.value);
    };

    const updateRows = (text) => {
        const newLines = text.split('\n').length;
        setRows(Math.min(Math.max(newLines, 1), 10)); // Limits between 2 and 10 rows
    };

    const onSendMessage = () => {
        handleSendMessage(); // Call the provided sendMessage function
        setRows(1); // Reset rows to initial size
    };

    return (
        <div className='flex items-end'>
            <textarea
                type='text'
                placeholder='Type your message...'
                value={newMessage}
                onChange={handleChange}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        onSendMessage();
                    } else {
                        handleKeyDown(e);
                    }
                }}
                rows={rows}
                className='flex-grow mr-2 border border-gray-300 p-2 min-w-36 rounded-lg outline-none resize-none'
            ></textarea>
            <button
                onClick={onSendMessage}
                className='bg-yellow-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                style={{ height: 'fit-content' }}
            >
                Send
            </button>
        </div>
    );
};

const formatMessage = (message) => {
    const codeBlockRegex = /```(.*?)```/gs;
    let formattedMessage = [];
    let lastIndex = 0;

    message.split(codeBlockRegex).forEach((part, index) => {
        if (index % 2 === 0) {
            // Regular text
            formattedMessage.push(
                <React.Fragment key={index}>
                    {part.split('\n').map((line, lineIndex) => (
                        <React.Fragment key={lineIndex}>
                            {line}
                            <br />
                        </React.Fragment>
                    ))}
                </React.Fragment>
            );
        } else {
            // Code block
            formattedMessage.push(<CodeBlock key={index} code={part} />);
        }

        lastIndex = index;
    });

    return <>{formattedMessage}</>;
};

export default Main;
