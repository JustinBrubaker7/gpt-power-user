const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function getChatTitleSummary(messages) {
    const MODEL = 'davinci-002'; // Or another suitable model
    // Concatenate all messages into a single string
    const chatContent = messages.map((message) => message.content).join('\n');

    // Construct a prompt for summarization
    const prompt = `Create a title for the following conversation in 1-5 words MAX You are to only use 1-5 words! :\n\n${chatContent}\n\ Title:`;

    try {
        const response = await openai.completions.create({
            model: MODEL,
            prompt: prompt,
        });

        // Return the summary text
        return response.choices[0]?.text.trim();
    } catch (error) {
        console.error('Error in generating chat summary:', error);
        return ''; // Return an empty string or handle the error as required
    }
}

module.exports = { getChatTitleSummary };
