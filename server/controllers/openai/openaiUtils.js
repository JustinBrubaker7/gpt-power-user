const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function getChatTitleSummary(messages) {
    const MODEL = 'gpt-3.5-turbo-1106'; // Or another suitable model
    // Concatenate all messages into a single string
    const chatContent = messages.map((message) => message.content).join('\n');

    // Construct a prompt for summarization
    const prompt = `Create a title or a summary that is user friendly for the following conversation in 1-5 words MAX You are to only use 1-5 words! :\n\n${chatContent}\n\ Title:`;

    try {
        const response = await openai.chat.completions.create({
            model: MODEL,
            messages: [
                {
                    content: prompt,
                    role: 'user',
                },
            ],

            max_tokens: 10,
            temperature: 0,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            stop: ['\n'],
        });

        // Return the summary text
        return response.choices[0].message.content;
    } catch (error) {
        console.error('Error in generating chat summary:', error);
        return ''; // Return an empty string or handle the error as required
    }
}

module.exports = { getChatTitleSummary };
