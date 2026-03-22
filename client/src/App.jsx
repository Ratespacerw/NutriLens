// client/src/App.jsx
import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          setImage(canvas.toDataURL('image/jpeg', 0.9));
          setResult(null);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!image) return;
    setLoading(true);
    try {
      // It detects if you are home or in the cloud.
      const API_URL = window.location.hostname === 'localhost' 
        ? 'http://localhost:5000/api/analyze' 
        : '/api/analyze';

      const response = await axios.post(API_URL, { image });
      setResult(response.data.result);
    } catch (error) {
      console.error(error);
      alert("Analysis failed. Please check your server connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {/* 1. Header & Logo */}
      {!result && (
        <div className="hero-section">
          <div className="brand-logo" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
            <svg width="100" height="100" viewBox="0 0 100 100">
              <path d="M50 90C20 70 5 50 5 30C5 15 20 10 35 10C43 10 50 17 50 17C50 17 57 10 65 10C80 10 95 15 95 30C95 50 80 70 50 90Z" stroke="#2563eb" strokeWidth="6" fill="none"/>
              <path d="M50 12C50 6 54 2 64 2" stroke="#2563eb" strokeWidth="6" strokeLinecap="round" fill="none"/>
              <path d="M15 50H35L42 25L58 75L65 50H85" stroke="#2563eb" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none">
                <animate attributeName="stroke-dasharray" values="0, 200; 200, 0" dur="2.5s" repeatCount="indefinite" />
              </path>
            </svg>
          </div>
          <h1 className="hero-title">NutriLens</h1>
          <p style={{ color: '#94a3b8', marginTop: '10px' }}>
            Advanced analysis for instant nutritional values!
          </p>
        </div>
      )}

      {/* 2. Upload Box */}
      {!result && (
        <div className="upload-box">
          <label style={{ cursor: 'pointer', display: 'block', color: '#94a3b8' }}>
            <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            <div style={{ padding: '10px', border: '1px solid #334155', borderRadius: '8px' }}>
              {image ? 'Change Selection' : 'Choose Food Image'}
            </div>
          </label>

          {image && (
            <div style={{ marginTop: '30px' }}>
              <img src={image} alt="Preview" style={{ width: '100%', borderRadius: '16px', border: '1px solid #334155' }} />
              <button className="btn-primary" onClick={analyzeImage} disabled={loading}>
                {loading ? 'Processing Data...' : 'Start Analysis Scan'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. The Result Dashboard */}
      {result && (
        <div className="result-card">
          <div className="data-label">Identified Dish</div>
          <h2 className="food-title">{result.foodName}</h2>
          
          <div className="calorie-number">{result.totalCalories}</div>
          <div className="data-label" style={{ color: '#2563eb' }}>Total Net Calories</div>

          {/* Itemized Breakdown Section */}
          <div className="breakdown-section">
            <div className="data-label" style={{ marginBottom: '10px', borderBottom: '1px solid #334155', paddingBottom: '8px' }}>
              Detailed Component Analysis
            </div>
            
            {result.ingredients.map((item, index) => (
              <div key={index} className="ingredient-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px', padding: '12px 0' }}>
                {/* Top Line: Name and Calories */}
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <span style={{ fontWeight: '600', color: '#f8fafc' }}>
                    {item.name} <small style={{ color: '#64748b', fontWeight: '400' }}>({item.amount})</small>
                  </span>
                  <span style={{ fontWeight: '700', color: '#2563eb' }}>{item.calories} kcal</span>
                </div>
                
                {/* Bottom Line: Individual Macros */}
                <div style={{ display: 'flex', gap: '15px', fontSize: '0.75rem', color: '#94a3b8' }}>
                  <span>Protein: <b style={{color: '#e2e8f0'}}>{item.protein}g</b></span>
                  <span>Carbs: <b style={{color: '#e2e8f0'}}>{item.carbs}g</b></span>
                  <span>Fat: <b style={{color: '#e2e8f0'}}>{item.fat}g</b></span>
                </div>
              </div>
            ))}
          </div>

          {/* Precise Macros Section */}
          <div className="macros-grid">
            <div className="macro-box">
              <span className="data-label" style={{fontSize: '0.65rem'}}>Protein</span>
              <span className="macro-val">{result.macros.protein}g</span>
            </div>
            <div className="macro-box">
              <span className="data-label" style={{fontSize: '0.65rem'}}>Carbs</span>
              <span className="macro-val">{result.macros.carbs}g</span>
            </div>
            <div className="macro-box">
              <span className="data-label" style={{fontSize: '0.65rem'}}>Fat</span>
              <span className="macro-val">{result.macros.fat}g</span>
            </div>
          </div>

          <button className="btn-secondary" onClick={() => { setImage(null); setResult(null); }}>
            Reset
          </button>
        </div>
      )}
    </div>
  );
}

export default App;