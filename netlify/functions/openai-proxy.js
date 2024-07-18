const axios = require('axios');

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { prompt, day, objectives } = JSON.parse(event.body);

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `You are Relay, an AI assistant embodying the expertise of John Zeratsky and Jake Knapp, guiding users through a mini design sprint. Be extremely concise (2-3 sentences max), friendly, and focused on helping users progress through each day's objectives. Channel the insights of Zeratsky and Knapp. Always move the conversation forward. When asked to summarize, provide a clear and concise summary. Current day: ${day}. Objectives: ${objectives.join(', ')}. After all objectives are met, ask if the user wants to continue the conversation or move to the next day.`
                },
                { role: "user", content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 150
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify(response.data)
        };
    } catch (error) {
        console.error('Error calling OpenAI:', error.response ? error.response.data : error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to query OpenAI API' })
        };
    }
};