require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

// 1. CLEAN THE API KEY
const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : "";
const genAI = new GoogleGenerativeAI(apiKey);

// 2. DEFINE THE STRUCTURE (Schema)
// This forces Gemini to provide decimal numbers for everything
const schema = {
  type: "object",
  properties: {
    foodName: { type: "string" },
    totalCalories: { type: "number" },
    ingredients: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          amount: { type: "string" },
          calories: { type: "number" },
          protein: { type: "number" },
          carbs: { type: "number" },
          fat: { type: "number" }
        }
      }
    },
    macros: {
      type: "object",
      properties: {
        protein: { type: "number" },
        carbs: { type: "number" },
        fat: { type: "number" }
      }
    }
  },
  required: ["foodName", "totalCalories", "ingredients", "macros"]
};

// 3. INITIALIZE MODEL (CRITICAL PART)
// We use gemini-flash-latest because it was the winner in your diagnostic test
const model = genAI.getGenerativeModel({ 
  model: "gemini-flash-latest",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: schema,
    temperature: 0.1, // Forces precision over creativity
  }
});

// Diagnostic Test
async function testAI() {
    try {
        console.log("📡 [System]: Testing connection to Gemini API...");
        await model.generateContent("Test");
        console.log("✅ [System]: Connection Successful!");
    } catch (err) {
        console.error("❌ [System]: Connection Failed.", err.message);
    }
}
testAI();

// 4. THE ANALYZE ENDPOINT
app.post('/analyze', async (req, res) => {
    console.log("📥 [Server]: Received image. Performing precision analysis...");
    try {
        const { image } = req.body;
        if (!image) return res.status(400).json({ error: "No image provided" });

        const base64Data = image.split(',')[1];
        const mimeType = image.split(';')[0].split(':')[1];

        const prompt = `Perform a high-precision nutritional deconstruction:
        1. Identify every individual ingredient/component in this image.
        2. Estimate the exact weight or volume for each component.
        3. Calculate the Calories, Protein, Carbs, and Fat for EACH ingredient using scientific data.
        4. Sum the values to provide a final total.
        
        CRITICAL: Use exact decimal values (e.g., 1.29 instead of 1). 
        Do not round to integers. Accuracy is more important than 'clean' numbers.`;

        const result = await model.generateContent([
            prompt,
            { inlineData: { data: base64Data, mimeType: mimeType } }
        ]);

        // Output is guaranteed to be JSON because of the responseSchema config
        const responseData = JSON.parse(result.response.text());
        res.json({ result: responseData });
        console.log("✅ [Server]: Analysis complete.");

    } catch (error) {
        console.error("🔥 [Server Error]:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Export for Vercel
module.exports = app;

// Only listen if NOT on Vercel
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Local server on ${PORT}`));
}