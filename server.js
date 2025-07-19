require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");

const app = express();

// CORS Setup - Add your Firebase Hosting URL later
app.use(cors({
  origin: ["http://localhost:3000", "https://anova-assistant.web.app"],
  methods: ["GET", "POST"],
  credentials: false
}));

app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Chat route
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: message
    });

    res.json({ reply: response.output_text });
  } catch (err) {
    console.error("OpenAI error:", err?.response?.data || err.message);
    res.status(500).json({ error: "AI request failed" });
  }
});

// Dynamic port for Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
