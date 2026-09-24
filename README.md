# AutoNest Workshop — Static HTML Demo

This version requires **no npm, React, Node.js, or build step**.

## Run locally

Simply double-click:

`index.html`

The website should open directly in your browser.

## Connect your FastAPI chatbot

Open:

`script.js`

At the top you will find:

```js
const API_URL = "http://localhost:8000";
```

Change it to your deployed FastAPI URL:

```js
const API_URL = "https://your-autonest-api.onrender.com";
```

The frontend sends:

```http
POST /chat
Content-Type: application/json
```

with:

```json
{
  "message": "wheel alignment koto?"
}
```

It expects:

```json
{
  "answer": "Your answer...",
  "sources": ["INFO-023"]
}
```

The `sources` field is optional.

## FastAPI CORS

Your FastAPI backend must allow the browser to call it.

For testing:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

For production, replace `*` with your actual frontend domain.

## Deploy

This folder can be deployed as a plain static site to Vercel, Netlify, GitHub Pages, or any static hosting provider.

For Vercel, the easiest approach is to upload/push the folder and use no build command. The entry point is `index.html`.

## Important

Do NOT put `HF_TOKEN` or any other secret in `script.js`.

Only the FastAPI backend should have the Hugging Face token.
