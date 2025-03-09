import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [cssCode, setCssCode] = useState("/* AI Generated CSS will appear here */");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) return setError("⚠️ Please enter a CSS description.");

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5050/generate-css", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
    
      if (!response.ok) throw new Error("❌ Failed to fetch CSS from server.");
    
      const data = await response.json();
      console.log("API Response:", data); // Debugging
    
      if (data.success && data.cssCode) {
        setCssCode(data.cssCode);
      } else {
        throw new Error("🤖 AI could not generate CSS. Try again.");
      }
    } catch (err) {
      setError((err as Error).message); // ✅ แก้ไขตรงนี้
    } finally {
      setIsLoading(false);
      }
    };

  const handleCopy = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000); // ลดเวลาเหลือ 3 วิ
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-10 flex flex-col items-center">
      <h1 className="text-5xl font-extrabold mb-6 text-center tracking-wide animate-pulse">
        ✨ AI CSS Generator ✨
      </h1>

      {/* Layout Wrapper */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6">
        {/* Left Side: Input */}
        <div className="flex-1 flex flex-col items-center">
          <div className="w-full max-w-2xl flex items-center space-x-3 bg-gray-800 p-3 rounded-lg shadow-lg">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your CSS (e.g., 'Beautiful animated button')"
              className="flex-1 p-3 bg-transparent border-b-2 border-gray-600 focus:border-blue-500 outline-none text-lg"
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            />
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className={`px-6 py-3 font-bold rounded-lg shadow-lg transition-all duration-300 hover:scale-105
                ${isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
            >
              {isLoading ? "Generating..." : "Generate CSS"}
            </button>
          </div>
          {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        </div>

        {/* Right Side: Generated CSS */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 max-w-2xl mx-auto"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">🎨 Generated CSS</h2>
              <button onClick={handleCopy} className="text-gray-400 hover:text-white">
                {copied ? <Check className="w-6 h-6 text-green-400" /> : <Copy className="w-6 h-6" />}
              </button>
            </div>
            <motion.pre
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-700 p-4 rounded-lg mt-3 overflow-x-auto text-sm border border-gray-600"
            >
              {cssCode}
            </motion.pre>
          </motion.div>
        </div>
      </div>
    </div>
  );
}