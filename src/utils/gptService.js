export const getGPTResponse = async (prompt, day, objectives) => {
    console.log('Starting getGPTResponse');
    console.log('Prompt:', prompt);
    console.log('Day:', day);
    console.log('Objectives:', objectives);

    try {
        console.time('API Call Time');
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.REACT_APP_GPT_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: `You are Relay, an AI assistant embodying the expertise of John Zeratsky and Jake Knapp, guiding users through a mini design sprint. Be extremely concise (2-3 sentences max), friendly, and focused on helping users progress through each day's objectives. Channel the insights of Zeratsky and Knapp. Always move the conversation forward. When asked to summarize, provide a clear and concise summary. Current day: ${day}. Objectives: ${objectives.join(', ')}. After all objectives are met, ask if the user wants to continue the conversation or move to the next day.`
                    },
                    { role: "user", content: prompt }
                ],
                temperature: 0.7,
                max_tokens: 150
            })
        });
        console.timeEnd('API Call Time');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.time('JSON Parse Time');
        const data = await response.json();
        console.timeEnd('JSON Parse Time');

        console.log('API Response:', data);

        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error in getGPTResponse:', error);
        throw error;
    }
};