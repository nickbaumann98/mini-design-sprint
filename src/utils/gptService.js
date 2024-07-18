export const getGPTResponse = async (prompt, day, objectives) => {
    console.log('Starting getGPTResponse');
    console.log('Prompt:', prompt);
    console.log('Day:', day);
    console.log('Objectives:', objectives);

    try {
        console.time('API Call Time');
        const response = await fetch('/.netlify/functions/openai-proxy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt, day, objectives })
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