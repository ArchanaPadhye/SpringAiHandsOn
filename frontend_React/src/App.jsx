import { useState } from 'react';

const tabs = [
  { id: 'stock', label: 'Stock Photo Generator' },
  { id: 'recipe', label: 'Recipe Generator' },
  { id: 'audio', label: 'Audio Transcription' }
];

const getApiUrl = (type) => {
  const env = import.meta.env || {};
  const apiUrlNames = {
    stock: ['STOCK_PHOTO', 'STOCK_PHOTO'],
    recipe: ['RECIPE', 'RECIPE'],
    audio: ['AUDIO_TRANSCRIPTION', 'AUDIO_TRANSCRIPTION']
  };
  const [viteName, reactName] = apiUrlNames[type];
  const configured = env[`VITE_${viteName}_API_URL`] || env[`REACT_APP_${reactName}_API_URL`];

  if (configured) {
    return configured;
  }

  const defaults = {
    stock: 'http://localhost:8080/generate-image',
    recipe: 'http://localhost:8080/recipe-creator',
    audio: 'http://localhost:8080/transcribe-audio'
  };

  return defaults[type];
};

function App() {
  const [activeTab, setActiveTab] = useState('stock');
  const [stockPrompt, setStockPrompt] = useState('');
  const [recipeIngredients, setRecipeIngredients] = useState('');
  const [recipeCuisine, setRecipeCuisine] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [stockImage, setStockImage] = useState('');
  const [recipeOutput, setRecipeOutput] = useState('');
  const [transcriptionOutput, setTranscriptionOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStockSubmit = async (event) => {
    event.preventDefault();

    if (!stockPrompt.trim()) {
      setError('Please enter the photo content you want to generate.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const apiUrl = getApiUrl('stock');
      const response = await fetch(`${apiUrl}?prompt=${encodeURIComponent(stockPrompt.trim())}`);

      if (!response.ok) {
        throw new Error('Unable to generate stock photo right now.');
      }

      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      if (stockImage.startsWith('blob:')) {
        URL.revokeObjectURL(stockImage);
      }
      setStockImage(imageUrl);
    } catch (fetchError) {
      setError(fetchError.message || 'Something went wrong while generating the stock photo.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecipeSubmit = async (event) => {
    event.preventDefault();

    if (!recipeIngredients.trim()) {
      setError('Please enter the ingredients you have available.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const apiUrl = getApiUrl('recipe');
      const params = new URLSearchParams({
        ingrediaents: recipeIngredients.trim(),
        cuisine: recipeCuisine.trim() || 'any',
        restrictions: dietaryRestrictions.trim()
      });
      const response = await fetch(`${apiUrl}?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Unable to generate a recipe right now.');
      }

      const recipeText = await response.text();
      if (!recipeText) {
        throw new Error('The API response did not include a recipe.');
      }

      setRecipeOutput(recipeText);
    } catch (fetchError) {
      setError(fetchError.message || 'Something went wrong while generating the recipe.');
    } finally {
      setLoading(false);
    }
  };

  const handleAudioSubmit = async (event) => {
    event.preventDefault();

    if (!audioFile) {
      setError('Please choose an audio file to transcribe.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', audioFile);
      const response = await fetch(getApiUrl('audio'), {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Unable to transcribe audio right now.');
      }

      const transcription = await response.text();
      if (!transcription.trim()) {
        throw new Error('The API response did not include a transcription.');
      }

      setTranscriptionOutput(transcription);
    } catch (fetchError) {
      setError(fetchError.message || 'Something went wrong while transcribing the audio.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <p className="eyebrow">AI Tools</p>
        <h1>Creative AI Generator</h1>
      </header>

      <div className="tabs" role="tablist" aria-label="AI generator tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={activeTab === tab.id ? 'tab active' : 'tab'}
            onClick={() => setActiveTab(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`${tab.id}-panel`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'stock' ? (
        <section className="panel" id="stock-panel" role="tabpanel">
          <h2>Stock Photo Generator</h2>
          <p className="intro">
            Use AI to create custom stock photos for marketing, product showcases, blog content,
            and creative campaigns.
          </p>
          <p className="welcome">Welcome! Tell us what kind of image you want to generate.</p>

          <form onSubmit={handleStockSubmit} className="generator-form">
            <label htmlFor="stock-content">Photo Content</label>
            <textarea
              id="stock-content"
              rows="5"
              value={stockPrompt}
              onChange={(event) => setStockPrompt(event.target.value)}
              placeholder="Describe the stock photo you want to generate, for example: a modern workspace with a laptop and coffee on a wooden desk"
            />

            <button type="submit" disabled={loading}>
              {loading ? 'Generating...' : 'Generate Stock Photo'}
            </button>
          </form>

          {error && <p className="message error">{error}</p>}

          {stockImage && (
            <div className="result-card">
              <img src={stockImage} alt="Generated stock content" />
              <a href={stockImage} target="_blank" rel="noreferrer">
                Open image
              </a>
            </div>
          )}
        </section>
      ) : activeTab === 'recipe' ? (
        <section className="panel" id="recipe-panel" role="tabpanel">
          <h2>Recipe Generator</h2>
          <p className="intro">
            Use AI to turn the ingredients you already have into a delicious recipe suggestion for
            any meal or occasion.
          </p>
          <p className="welcome">Welcome! Share your ingredients and recipe preferences.</p>

          <form onSubmit={handleRecipeSubmit} className="generator-form">
            <label htmlFor="recipe-ingredients">Ingredients</label>
            <textarea
              id="recipe-ingredients"
              rows="5"
              value={recipeIngredients}
              onChange={(event) => setRecipeIngredients(event.target.value)}
              placeholder="Example: chicken, garlic, rice, spinach, lemon, olive oil"
            />

            <label htmlFor="recipe-cuisine">Cuisine</label>
            <input
              id="recipe-cuisine"
              type="text"
              value={recipeCuisine}
              onChange={(event) => setRecipeCuisine(event.target.value)}
              placeholder="Example: Mexican, Chinese, or Continental"
            />

            <label htmlFor="dietary-restrictions">Dietary Restrictions</label>
            <input
              id="dietary-restrictions"
              type="text"
              value={dietaryRestrictions}
              onChange={(event) => setDietaryRestrictions(event.target.value)}
              placeholder="Example: vegetarian or gluten-free"
            />

            <button type="submit" disabled={loading}>
              {loading ? 'Generating...' : 'Generate Recipe'}
            </button>
          </form>

          {error && <p className="message error">{error}</p>}

          <div className="recipe-output">
            <label htmlFor="recipe-result">Generated Recipe</label>
            <textarea
              id="recipe-result"
              className="result-textarea"
              value={recipeOutput}
              readOnly
              placeholder="Your generated recipe will appear here."
            />
          </div>
        </section>
      ) : null}

      {activeTab === 'audio' && (
        <section className="panel" id="audio-panel" role="tabpanel">
          <h2>Audio Transcription</h2>
          <p className="intro">
            Use AI to turn an audio recording into readable text.
          </p>
          <p className="welcome">Welcome! Upload an audio file to get started.</p>

          <form onSubmit={handleAudioSubmit} className="generator-form">
            <label htmlFor="audio-file">Audio File</label>
            <input
              id="audio-file"
              type="file"
              accept="audio/*,.mp3,.wav"
              onChange={(event) => setAudioFile(event.target.files?.[0] || null)}
            />

            <button type="submit" disabled={loading}>
              {loading ? 'Transcribing...' : 'Transcribe Audio'}
            </button>
          </form>

          {error && <p className="message error">{error}</p>}

          <div className="transcription-output">
            <label htmlFor="transcription-result">Transcribed Text</label>
            <textarea
              id="transcription-result"
              className="result-textarea"
              value={transcriptionOutput}
              readOnly
              placeholder="Your transcription will appear here."
            />
          </div>
        </section>
      )}
    </div>
  );
}

export default App;
