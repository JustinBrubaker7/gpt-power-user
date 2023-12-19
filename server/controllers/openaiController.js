const OpenAI = require('openai');
const { addChat } = require('./chatController');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function completeChatStream({ ws, message, WebSocket }) {
    const data = JSON.parse(message);
    console.log(data);

    // Add chat to the database
    const dataSaved = await addChat(data.messages, data.settings);

    const stream = await openai.chat.completions.create({
        model: data.settings.model,
        messages: data.messages,
        stream: true,
        temperature: data.settings.temperature,
    });

    if (dataSaved.id) {
        // Send the chat id to the client
        ws.send(JSON.stringify({ id: dataSaved.id }));
    }

    for await (const chunk of stream) {
        const data = chunk.choices[0]?.delta?.content || '';
        // Send the response only to the WebSocket that sent the message
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ message: data }));
        }
    }
}

async function getChatTitleSummary(messages) {
    // Concatenate all messages into a single string
    const chatContent = messages.map((message) => message.content).join('\n');

    // Construct a prompt for summarization
    const prompt = `Create a title for the following conversation in 1-5 words MAX You are to only use 1-5 words! :\n\n${chatContent}\n\ Title:`;

    try {
        const response = await openai.completions.create({
            model: 'text-davinci-003', // Or another suitable model
            prompt: prompt,
        });

        // Return the summary text
        return response.choices[0]?.text.trim();
    } catch (error) {
        console.error('Error in generating chat summary:', error);
        return ''; // Return an empty string or handle the error as required
    }
}

module.exports = { completeChatStream, getChatTitleSummary };
