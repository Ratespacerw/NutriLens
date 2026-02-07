# 🍎 NutriLens | Precision AI Nutritional Analysis

**NutriLens** is a full-stack AI application designed to deconstruct food images into itemized nutritional data. Unlike standard calorie counters that provide vague estimates, NutriLens utilizes advanced computer vision to identify individual ingredients, estimate their weight in grams, and calculate macronutrients with decimal-level precision.

## 🚀 The Problem & Solution
Most nutrition apps struggle with complex plates (like salads or smoothie bowls) and often round off values, leading to significant caloric discrepancies. 

**NutriLens solves this by:**
1. **Ingredient Deconstruction:** Breaking down a single image into an itemized list of components.
2. **Decimal Accuracy:** Utilizing Gemini 1.5 Flash with a custom JSON Schema to enforce 2-decimal precision for Protein, Carbs, and Fats.
3. **Format Compatibility:** Implementing a client-side Canvas API "converter" to handle modern image formats (AVIF/WebP) that standard APIs often reject.

## 🛠️ Tech Stack

### Frontend
- **React (Vite):** Functional components and Hooks for state management.
- **Axios:** Asynchronous API communication.
- **HTML5 Canvas API:** Client-side image processing and JPEG conversion.
- **CSS3:** Custom "Deep Sea Blue" theme featuring Glassmorphism and responsive Grids.

### Backend
- **Node.js & Express:** RESTful API architecture.
- **Google Gemini API SDK:** Integration of 1.5 Flash model.
- **Dotenv:** Secure environment variable management for API credentials.

## 🧠 Key Technical Features

### 1. Structured Output Enforcement
The backend utilizes a strict **JSON Schema** within the Gemini model configuration. This forces the AI to return data in a predictable object format, preventing "hallucinations" and ensuring the frontend can reliably map through ingredients.

### 2. Low-Temperature Precision
By setting the model **temperature to 0.1**, the application prioritizes mathematical accuracy and nutritional data consistency over creative text generation.

### 3. Asynchronous Data Flow
The app manages multiple states (Idle, Processing, and Result) to provide a seamless user experience, utilizing `FileReader` for instant local image previews before server-side analysis.
