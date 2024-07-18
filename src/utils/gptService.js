export const getGPTResponse = async (prompt, day, objectives) => {
    console.log('Starting getGPTResponse');
    console.log('Prompt:', prompt);
    console.log('Day:', day);
    console.log('Objectives:', objectives);

    try {
        const response = await fetch('/.netlify/functions/openai-proxy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt, day, objectives })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error in getGPTResponse:', error);
        throw error;
    }
};