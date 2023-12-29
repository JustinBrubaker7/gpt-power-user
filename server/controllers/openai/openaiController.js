const OpenAI = require('openai');
const { addChat } = require('../chatController');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function completeChatStream({ ws, message, WebSocket }) {
    const data = JSON.parse(message);
    console.log(data);

    // Initialize a new object to be added to the messages
    const newMessage = {
        content: '',
        role: 'assistant',
    };

    const stream = await openai.chat.completions.create({
        model: data.settings.model,
        messages: data.messages,
        stream: true,
        temperature: data.settings.temperature,
    });

    for await (const chunk of stream) {
        const streamedContent = chunk.choices[0]?.delta?.content || '';
        // Update the new message with streamed content
        newMessage.content += streamedContent; // Append streamed content

        // Send the response only to the WebSocket that sent the message
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ message: streamedContent }));
        }
    }

    // Add the updated message to the beginning of the messages array
    data.messages.push(newMessage);

    // Now that the loop is complete, add chat to the database
    const dataSaved = await addChat(data.messages, data.settings);

    if (dataSaved.id) {
        // Send the chat id to the client
        ws.send(JSON.stringify({ id: dataSaved.id }));
    }
}

module.exports = { completeChatStream };
