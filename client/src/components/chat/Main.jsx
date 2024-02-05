import React, { useState, useEffect, useRef, useCallback } from 'react';
import SidebarShell from '../../layout/SidebarShell.jsx';
import { useAuth } from '../../context/auth-context.jsx';
import { useLocation } from 'react-router-dom';
import { establishWebSocketConnection, fetchChatById } from '../../api/chat.js';
import { getAllShortCuts, deleteShortCut } from '../../api/shortcut.js';
import CodeBlock from './code-block/CodeBlock.jsx';
import { TrashIcon } from '@heroicons/react/24/outline';
import parse from 'html-react-parser';

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
    const { currentUser, logout } = useAuth();

    const ws = useRef(null);
    const endOfMessagesRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [chatId, setChatId] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Added
    const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo-1106');
    const [settings, setSettings] = useState({
        model: selectedModel,
        temperature: 1, // Hardcoded temperature
        conversationType: messages.length ? 'continue' : 'new',
        userId: currentUser.userId,
        models: models,
        maxLength: 4096,
        topP: 1,
        frequencyPenalty: 0,
        presencePenalty: 0,
    });

    useEffect(() => {
        setSettings((settings) => ({ ...settings, model: selectedModel }));
    }, [selectedModel]);

    useEffect(() => {
        setSelectedModel(settings.model);
    }, [settings.model]);

    const [shortcuts, setShortcuts] = useState([]);

    const location = useLocation();

    useEffect(() => {
        if (currentUser) {
            getAllShortCuts(currentUser).then((shortcuts) => {
                setShortcuts(shortcuts);
            });
        }
    }, []);

    useEffect(() => {
        // see if the windoe is /chat/:chatId
        const chatIdFromUrl = window.location.pathname.split('/').pop();

        if (chatIdFromUrl) {
            fetchChatById(chatIdFromUrl, currentUser).then((chat) => {
                if (chat.error) {
                    logout();
                    return;
                }
                setChatId(chatIdFromUrl);
                setMessages(JSON.parse(chat.messages));
                setSelectedModel(chat.model);
                setIsLoading(false);
            });
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
                ...settings,
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
            handleSendMessage();
        } else if (event.keyCode === 13 && event.shiftKey) {
            // If Shift is also held down, do not submit
        }
    };

    if (isLoading)
        return (
            <div className='flex justify-center items-center h-screen '>
                <h1 className='text-white text-3xl'>Loading...</h1>
            </div>
        );

    return (
        <SidebarShell settings={settings} setSettings={setSettings} chatId={chatId}>
            <Header
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
                models={models}
                disabled={messages.length}
            />
            <div className='flex flex-col h-4/5 fixed bottom-5 md:bottom-10 md:w-5/6 pr-2'>
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
                    shortcuts={shortcuts}
                    setShortcuts={setShortcuts}
                    currentUser={currentUser}
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
        <div id='no-scrollbar' className=' flex-grow overflow-y-auto mb-2 p-2 mx-auto w-full md:w-3/5'>
            {messages.map((message, index) => (
                <div key={index} className={`text-white flex flex-col items-start py-2`}>
                    <div className={`flex flex-col items-start`}>
                        <div className={`flex flex-col p-2 min-w-36 rounded-lg `}>
                            <div
                                className={`text-xs text-gray-500  ${
                                    message.role === 'user' ? 'text-left' : 'text-left'
                                } flex items-center pb-2`}
                            >
                                <span className='inline-block h-6 w-6 overflow-hidden rounded-full bg-gray-100'>
                                    <svg className='h-full w-full text-gray-300' fill='currentColor' viewBox='0 0 24 24'>
                                        <path d='M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z' />
                                    </svg>
                                </span>{' '}
                                <p className='ml-2'>{message.role === 'user' ? 'You' : `${modelName}`}</p>
                            </div>
                            <div className='text-md'>{formatMessage(message.content)}</div>
                        </div>
                    </div>
                </div>
            ))}
            <div ref={endOfMessagesRef} />
        </div>
    );
});

const MessageInput = ({
    newMessage,
    setNewMessage,
    handleSendMessage,
    handleKeyDown,
    shortcuts,
    setShortcuts,
    currentUser,
}) => {
    const [rows, setRows] = useState(1);
    const [showShortcuts, setShowShortcuts] = useState(false);
    const [filterText, setFilterText] = useState('');
    const [focusedShortcutIndex, setFocusedShortcutIndex] = useState(-1); // New state for focused shortcut

    const handleKeyDown2 = (e) => {
        if (showShortcuts) {
            if (e.key === 'Tab') {
                e.preventDefault(); // Prevent default tabbing behavior
                const filteredShortcuts = shortcuts.filter((shortcut) =>
                    shortcut.name.toLowerCase().includes(filterText.toLowerCase())
                );
                const newIndex = (focusedShortcutIndex + 1) % filteredShortcuts.length;
                setFocusedShortcutIndex(newIndex);
            }
        } else {
            // Other key handling
        }
    };

    const addShortcutText = (text) => {
        setNewMessage((currentMessage) => currentMessage.slice(0, -filterText.length - 1) + text + ' ');
        setShowShortcuts(false);
        setFilterText(''); // Clear filter text after selection
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setNewMessage(value);
        updateRows(value);

        if (value.endsWith('/')) {
            const parts = value.split('/');
            const lastPart = parts[parts.length - 1];
            setShowShortcuts(true);
            setFilterText(lastPart); // Set filter text based on the last part after "/"
        } else {
            setShowShortcuts(false);
            setFilterText('');
        }
    };
    const updateRows = (text) => {
        const newLines = text.split('\n').length;
        setRows(Math.min(Math.max(newLines, 1), 10));
    };

    const onSendMessage = () => {
        handleSendMessage();
        setRows(1);
        setShowShortcuts(false); // Hide shortcuts when message is sent
    };

    const renderShortcuts = () => {
        if (!showShortcuts) return null;

        // Filter the shortcuts based on the filterText
        const filteredShortcuts = shortcuts.filter((shortcut) =>
            shortcut.name.toLowerCase().includes(filterText.toLowerCase())
        );

        if (!filteredShortcuts.length) {
            return (
                <div className='absolute bg-white border p-2 bottom-11'>
                    <ul>
                        <li onClick={() => setShowShortcuts(true)} className='text-gray-500 text-sm '>
                            No shortcuts found. Open advanced settings to add a shortcut
                        </li>
                    </ul>
                </div>
            );
        }

        const handleDeleteShortcut = (shortcutId) => {
            deleteShortCut(currentUser, shortcutId).then(() => {
                getAllShortCuts(currentUser).then((shortcuts) => {
                    setShortcuts(shortcuts);
                });
            });
        };

        return (
            <div className='absolute bg-white border p-2 bottom-11'>
                <ul>
                    {filteredShortcuts.map((shortcut, index) => (
                        <ShortCutRow
                            key={shortcut.id}
                            shortcut={'/' + shortcut.name}
                            shortcutId={shortcut.id}
                            text={shortcut.text}
                            isFocused={index === focusedShortcutIndex}
                            currentUser={currentUser}
                            handleDeleteShortcut={handleDeleteShortcut}
                        />
                    ))}
                </ul>
            </div>
        );
    };

    const ShortCutRow = ({ shortcut, text, isFocused, handleDeleteShortcut, shortcutId }) => {
        return (
            <div
                className={`flex items-center border-b p-2 ${
                    isFocused ? 'bg-blue-100' : 'hover:bg-gray-100'
                } cursor-pointer`}
                onClick={() => addShortcutText(text)}
            >
                <span className='text-gray-500 text-sm'>{shortcut}</span>
                <span className='text-gray-500 text-sm ml-2'>-</span>
                <span className='text-gray-500 text-sm ml-2'>{text.length > 75 ? `${text.slice(0, 75)}...` : text}</span>
                <span className='text-gray-500 text-sm ml-auto'>
                    <TrashIcon
                        className='h-4 w-4 text-gray-500 hover:text-red-500'
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteShortcut(shortcutId);
                        }}
                    />
                </span>
            </div>
        );
    };

    return (
        <div className='relative flex items-end w-full md:w-4/5 mx-auto'>
            <textarea
                type='text'
                placeholder='Type your message... or use / to access your shortcuts'
                value={newMessage}
                onChange={handleChange}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (showShortcuts && focusedShortcutIndex >= 0) {
                            const filteredShortcuts = shortcuts.filter((shortcut) =>
                                shortcut.name.toLowerCase().includes(filterText.toLowerCase())
                            );
                            addShortcutText(filteredShortcuts[focusedShortcutIndex].text);
                            setFocusedShortcutIndex(-1); // Reset focus index
                        } else {
                            onSendMessage();
                        }
                    } else {
                        handleKeyDown2(e);
                    }
                }}
                rows={rows}
                className='flex-grow mr-2 border border-gray-300 p-2 min-w-36 rounded-lg outline-none resize-none'
            ></textarea>
            {renderShortcuts()}
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
            // Enhanced regular text processing to handle markdown formatting
            formattedMessage.push(
                <React.Fragment key={index}>
                    {part.split('\n').map((line, lineIndex) => {
                        // Check for bold text and replace it with <b> tags
                        let boldFormatted = line.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
                        // Check for titles and replace them with appropriate heading tags
                        let titleFormatted = boldFormatted.replace(/^###\s?(.*)/g, '<h3>$1</h3>');

                        let italicFormatted = titleFormatted.replace(/\*(.*?)\*/g, '<i>$1</i>');

                        let linkFormatted = italicFormatted.replace(
                            /\[(.*?)\]\((.*?)\)/g,
                            '<a href="$2" target="_blank">$1</a>'
                        );

                        // Parse the resulting string to convert it into JSX elements
                        // This uses a simple approach and may need to be enhanced for complex scenarios
                        const formattedLine = parseFormattedText(linkFormatted);

                        return (
                            <React.Fragment key={lineIndex}>
                                {formattedLine}
                                <br />
                            </React.Fragment>
                        );
                    })}
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

const parseFormattedText = (text) => {
    // Convert HTML string into React elements using html-react-parser
    return parse(text, {});
};

export default Main;
