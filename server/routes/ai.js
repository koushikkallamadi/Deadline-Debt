const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// @route   POST /api/ai/chat
// @desc    Send a message to the Gemini AI Advisor
// @access  Private
router.post('/chat', auth, async (req, res) => {
    try {
        const { message, contextTasks } = req.body;

        // Make sure the user provided an API key in their .env
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({
                error: 'Gemini API key is missing. Please add GEMINI_API_KEY to your server/.env file.'
            });
        }

        // Initialize the Gemini client with the API key
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Build a system prompt that explains the app, the algorithms, and the user's current data
        const systemPrompt = `You are the AI Advisor inside a web app called "DeadlineDebt". 
The user is a student using this app to manage their deadlines. They can ask you general questions OR questions about their tasks and the app's algorithms.

APP RULES & ALGORITHMS:
1. Debt Score: Calculated based on pending topics. Every pending topic adds 3 base points.
2. Overdue Penalty: The exact millisecond a task passes its Due Date, it is overdue. It adds 15 points to the debt score per FULL DAY it is late.
3. Early Bird Bonus: If a task's Due Date is >7 days in the future, it gives a -20 point bonus.
4. Scale Down Formula: The final debt score is scaled down proportionally by how many topics are finished. Check off topics to lower the debt.
5. Cleared: A task is "Cleared" (and added to Achievements) only when ALL of its topics are checked off.
6. Features: The app has a Pomodoro Study Timer (25m/5m breaks with a custom option), Dark Mode settings, and an Achievements streak board.

USER'S CURRENT TASK DATA (JSON format):
${JSON.stringify(contextTasks, null, 2)}

YOUR PERSONALITY:
- Helpful, encouraging, and slightly futuristic/mission-control themed (the app uses glowing orbs and dark mode).
- If they ask general knowledge questions, answer them accurately and fully.
- If they ask about their tasks, reference the JSON data above.
- Keep your answers relatively concise to fit inside a small chat widget screen. Use formatting like bullet points or bold text to make it easy to read.`;

        // Call the Gemini API
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\nUser message: ${message}` }] }],
            generationConfig: {
                maxOutputTokens: 500,
                temperature: 0.7,
            },
        });

        const reply = result.response.text();

        // Send the AI's text response back to the frontend
        res.json({ reply });

    } catch (err) {
        console.error('AI Chat Error:', err.message);
        res.status(500).json({ error: 'Failed to communicate with AI Advisor. Check your API key or try again.' });
    }
});

module.exports = router;
