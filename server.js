const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
// Serve static files from the current directory
app.use(express.static(__dirname));

app.post('/api/chat', async (req, res) => {
    try {
        const { text } = req.body;
        
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'API key is not configured on the server' });
        }

        // Use global fetch (available in Node.js 18+)
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
});

const fs = require('fs');

function startServer(port) {
    const server = app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
        try {
            fs.writeFileSync('backend_port.json', JSON.stringify({ port: port }));
        } catch(e) {
            console.error('Failed to write backend_port.json', e);
        }
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Port ${port} is occupied, trying ${port + 1}...`);
            startServer(port + 1);
        } else {
            console.error('Server Error:', err);
        }
    });
}

startServer(PORT);
