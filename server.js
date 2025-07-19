// backend/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { OpenAI } = require("openai");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Add your OpenAI API key in .env
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: message,
    });
    res.json({ reply: response.output_text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(5000, () => console.log("Backend running on http://localhost:5000"));
