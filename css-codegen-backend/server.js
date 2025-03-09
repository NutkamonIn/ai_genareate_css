require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// ✅ ดึงค่าจาก .env
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "tinyllama";
const OLLAMA_HOST = process.env.OLLAMA_HOST || "ollama:11434";
const FRONTEND_URL = process.env.FRONTEND_URL || "frontend:5173";
const PORT = process.env.PORT || 5050;

console.log(`🦙 Using Ollama Model: ${OLLAMA_MODEL}`);
console.log(`🔗 Connecting to Ollama at: ${OLLAMA_HOST}`);

// ✅ CORS Configuration
app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
}));

// ✅ ตรวจสอบว่า Ollama ทำงานอยู่หรือไม่
async function checkOllamaStatus() {
    try {
        const response = await axios.get(`${OLLAMA_HOST}/api/tags`);
        if (response.status === 200) {
            console.log("✅ Ollama is running!");
            return true;
        }
    } catch (error) {
        console.error("❌ Ollama ไม่ตอบสนอง:", error.message);
        return false;
    }
}

// 🔍 **GET: ตรวจสอบสถานะเซิร์ฟเวอร์**
app.get("/health", async (req, res) => {
    const isOllamaRunning = await checkOllamaStatus();
    res.json({ success: isOllamaRunning, status: isOllamaRunning ? "Ollama is running" : "Ollama ไม่ตอบสนอง" });
});

// 🚀 **POST: Generate CSS จาก Ollama**
app.post("/generate-css", async (req, res) => {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
        return res.status(400).json({ success: false, message: "Invalid prompt" });
    }

    console.log("📩 Request Received:", prompt);

    try {
        const requestData = {
            model: OLLAMA_MODEL,
            prompt: `Write minimal CSS for: ${prompt}`,
            stream: false,
        };

        console.log("📤 Sending request to Ollama:", requestData);

        const response = await axios.post(`${OLLAMA_HOST}/api/generate`, requestData, {
            headers: { "Content-Type": "application/json" },
        });

        console.log("📥 Response from Ollama:", response.data);

        if (!response.data || !response.data.response) {
            throw new Error("No response from Ollama");
        }

        let cssCode = extractCSS(response.data.response);
        function extractCSS(text) {
            const regex = /```css\n([\s\S]*?)\n```/; // ค้นหาส่วนที่อยู่ระหว่าง ```css และ ```
            const match = text.match(regex);
            return match ? match[1].trim() : "/* No CSS found */";
        }
        res.json({ success: true, cssCode });
    } catch (error) {
        console.error("❌ Server Error:", error.response?.data || error.message);
        res.status(500).json({ success: false, message: "Ollama ไม่ตอบสนอง" });
    }
});

// 🏁 **เริ่มต้นเซิร์ฟเวอร์**
(async () => {
    const isOllamaRunning = await checkOllamaStatus();
    if (!isOllamaRunning) {
        console.error("❌ Ollama ยังไม่ทำงาน! กรุณาเริ่ม Ollama ก่อน 🚀");
        process.exit(1);
    }

    app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
    });
})();