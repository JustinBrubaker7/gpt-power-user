const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function completeChatStream({ ws, message, WebSocket }) {
    const data = JSON.parse(message);
    console.log(data);
    const stream = await openai.chat.completions.create({
        model: data.settings.model,
        messages: data.messages,
        stream: true,
        temperature: data.settings.temperature,
    });

    for await (const chunk of stream) {
        const data = chunk.choices[0]?.delta?.content || '';
        // Send the response only to the WebSocket that sent the message
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(data);
        }
    }
}

module.exports = { completeChatStream };
