require('dotenv').config();

module.exports = async (req, res) => {
    // Enable CORS for the Serverless Function
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const { text } = req.body;
        
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'API key is not configured on the server' });
        }

        // Call Gemini API
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{ text: "You are an expert AI Financial Advisor. Provide clear, concise, and professional financial advice for the following query. Format your response with markdown. Query: " + text }]
                }]
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            res.json(data);
        } else {
            console.error("Gemini API Error:", data);
            res.status(response.status).json(data);
        }

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
