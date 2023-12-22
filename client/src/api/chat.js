export const establishWebSocketConnection = (ws, currentUser, newMessage, setMessages, selectedModel, setSettings) => {
    if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
        console.log('Establishing new WebSocket connection');
        ws.current = new WebSocket(`ws://localhost:3000${currentUser ? `?userId=${currentUser.token}` : ''}`);

        ws.current.onopen = () => {
            console.log('Connected to the server');
            if (newMessage.trim()) {
                // Send the initial user message as a serialized JSON object
                const userMessage = createMessageObject(newMessage, 'user', selectedModel);
                console.log('Sending message:', userMessage);
                ws.current.send(JSON.stringify(userMessage));

                // Add the initial user message to the messages array
                setMessages([
                    {
                        content: newMessage,
                        role: 'user',
                    },
                ]);
            }
        };
        ws.current.onmessage = (event) => {
            console.log('Received message:', event.data);
            let eventMessage = JSON.parse(event.data).message;

            if (JSON.parse(event.data).id) {
                setSettings((prevSettings) => {
                    return { ...prevSettings, id: JSON.parse(event.data).id };
                });

                return event.data.id;
            }

            const processMessage = (text) => {
                setMessages((prevMessages) => {
                    // Check if the last message exists and is from the assistant
                    if (prevMessages.length > 0 && prevMessages[prevMessages.length - 1].role === 'assistant') {
                        // Clone the last message
                        const lastMessage = prevMessages[prevMessages.length - 1];
                        const updatedContent = lastMessage.content + text; // Append the new text to the existing text

                        // Replace the last message with the updated one
                        const updatedLastMessage = {
                            ...lastMessage,
                            content: updatedContent,
                        };

                        return [...prevMessages.slice(0, -1), updatedLastMessage];
                    } else {
                        // Add a new message
                        const newMessage = { content: `${text}`, role: 'assistant' };
                        return [...prevMessages, newMessage];
                    }
                });
            };

            // Check if the message is a Blob
            if (event.data instanceof Blob) {
                // Convert Blob to text
                const reader = new FileReader();
                reader.onload = () => {
                    const text = reader.result;
                    processMessage(text);
                };
                reader.readAsText(eventMessage);
            } else {
                // Directly process text messages
                processMessage(eventMessage);
            }
        };
        ws.current.onclose = () => {
            console.log('Disconnected from the server');
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }
};

const createMessageObject = (content, role, modelId) => {
    return {
        settings: {
            model: modelId,
            temperature: 0.7, // Hardcoded temperature
            conversationType: 'new',
        },
        messages: [
            {
                content,
                role,
            },
        ],
    };
};

export const getAllChats = async (user) => {
    try {
        console.log(user.userId);
        const response = await fetch(`http://localhost:3000/chat/getall?userId=${user.userId}`, {
            method: 'GET',
            headers: {
                authorization: `${user.token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch chats');
        }

        const chats = await response.json();
        return chats;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch chats');
    }
};

export const fetchChatById = async (chatId, user) => {
    try {
        const response = await fetch(`http://localhost:3000/chat/getchat?chatId=${chatId}&userId=${user.userId}`, {
            method: 'GET',
            headers: {
                authorization: `${user.token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch chat');
        }

        const chat = await response.json();
        return chat.chat;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch chat');
    }
};
