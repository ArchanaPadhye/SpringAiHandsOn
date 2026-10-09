Write your specification in clear Markdown format (spec-feature-name.md), detailing requirements, boundaries, constraints, and data contracts.

# React Website for AI calls

Create React Website having a webpage with 3 tabs : 
1. **Stock Photo Generator**: This tab will allow users to generate stock photos using AI. It should include a brief introduction to the AI call feature, a welcome message, and a call-to-action button that directs users to the AI call functionality.
2. **Recipe Generator**: This tab will enable users to generate recipes based on ingredients they provide. It should include a brief introduction to the AI call feature, a welcome message, and a call-to-action button that directs users to the AI call functionality.
3. **Audio Transcription**: This tab will allow users to upload audio files.
 It should include a brief introduction to the AI call feature, a welcome message, and a call-to-action button that directs users to the AI call functionality.
## Requirements for Stock Photo Generator Tab
- The tab should have a clear title: "Stock Photo Generator".
- Include a brief introduction explaining the purpose of the AI call feature for generating stock photos.
- Display a welcome message to the users.
- Provide a textbox named labelled as **Photo Content** where users can input a description of the stock photo they want to generate.
- Include a call-to-action button labeled "Generate Stock Photo" that, when clicked, call goes to url provided in React application properties file (e.g., `REACT_APP_STOCK_PHOTO_API_URL`).
- The generated stock photo should be displayed below the button once the API call is successful.

## Requirements for Recipe Generator Tab
- The tab should have a clear title: "Recipe Generator".
- Include a brief introduction explaining the purpose of the AI call feature for generating recipes.
- Display a welcome message to the users.
- Provide three textboxes named labelled as 
**Ingredients** where users can input the ingredients they have available
**cuisine** where users can input the type of cuisine they want the recipe to be based on(e.g., mexican, chinese, continental), 
 and **Dietary Restrictions** where users can input any dietary restrictions they have (e.g., vegetarian, gluten-free),
- Provide non-editabe textbox where the response from server will be displayed. Size this textbox large enough to accommodate the recipe text.
- Include a call-to-action button labeled "Generate Recipe" that, when clicked, call goes to url provided in React application properties file (e.g., `REACT_APP_RECIPE_API_URL`).
- The generated recipe should be displayed below the button once the API call is successful.

### Requirements for Audio Transcription Tab
- The tab should have a clear title: "Audio Transcription".
- Include a brief introduction explaining the purpose of the AI call feature for transcribing audio files.
- Display a welcome message to the users.
- Provide a file upload input where users can upload audio files (e.g., .mp3, .wav).
- Provide a non-editable textbox where the transcribed text from the server will be displayed. Size this textbox large enough to accommodate the transcribed text.
- Include a call-to-action button labeled "Transcribe Audio" that, when clicked, call goes to url provided in React