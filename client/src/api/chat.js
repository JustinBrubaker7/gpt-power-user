export const establishWebSocketConnection = (ws, currentUser, newMessage, setMessages, selectedModel) => {
    if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
        console.log('Establishing new WebSocket connection');
        ws.current = new WebSocket(`ws://localhost:8080${currentUser ? `?userId=${currentUser.token}` : ''}`);

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
                reader.readAsText(event.data);
            } else {
                // Directly process text messages
                processMessage(event.data);
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
         },
         messages: [
             {
                 content,
                 role,
             },
         ],
     };
 };