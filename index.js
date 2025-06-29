const express = require("express");
const bodyParser = require("body-parser");
const { fetch } = require("undici");
require("dotenv").config();

const app = express();
app.use(express.static("public"));
app.use(bodyParser.json());

const API_KEY = process.env.OPENAI_API_KEY;

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Sen Haxball odasında konuşan Türkçe bir yapay zekasın." },
          { role: "user", content: userMessage },
        ],
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "🤖 Bir hata oluştu.";

    res.json({ reply });
  } catch (err) {
    console.error("ChatGPT API hatası:", err);
    res.status(500).json({ reply: "Sunucu hatası." });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Sunucu ${port} portunda çalışıyor`);
});
