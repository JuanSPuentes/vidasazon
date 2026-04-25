# VidaSazón 🌱🩺
> **The Flavor that Rewrites your Health.**

VidaSazón is a premium, clinical-grade recipe platform focused on blood sugar management. Serving 718 nutritionist-approved recipes designed specifically for people with Type 2 Diabetes, integrating strict Glycemic Index (GI) monitoring calculated artificially using AI tools.

## 🚀 Key Features

- **718 Clinical Recipes:** Spanning 9 categories including Main Dishes, Desserts, Breakfast, and Soups.
- **AI-Powered Nutrition Analysis:** Calories, custom macros, and GI indexing computed offline using Google Gemini 2.5 Flash via OpenRouter.
- **Visual GI Badging:** A "Botanical Apothecary" UI that alerts users in real-time if a recipe is Low (Safe), Medium, or High glycemic impact.
- **Seamless SEO & E-E-A-T Architecture:** Automated `sitemap.xml` mapping, JSON-LD Schema.org recipes, and perfect LightHouse indexing capabilities out of the box.
- **Responsive Aesthetic Layout:** Smooth, grid-busting UX inspired by vintage apothecaries and luxury editorial layouts (developed in CSS/Vite).

## 🛠 Tech Stack

- **Framework:** React + Vite (Fast SPA routing using robust Contexts instead of bulky routers)
- **Styling:** Custom Vanilla CSS (Apothecary Edition / Glassmorphism)
- **Data Engineering:** Python (HuggingFace datasets, Pandas Dataframes, LLM base64 image encoding generation)
- **AI Tools:** `google/gemini-2.5-flash` for data manipulation, `google/gemini-2.5-flash-image` for stunning aesthetic generation.

## ⚙️ Installation & Usage

### 1. Install Node Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

### 3. Build & Generate Sitemaps (Production)
```bash
npm run build
```
*(This command automatically fires the `generate_sitemap.js` script to securely build all 718 links into `public/sitemap.xml` ensuring your search-engine crawlers find the new images and data).*

---
**Disclaimer:** *The nutritional values are computationally estimated through LLM models. While tested and highly accurate for baseline culinary data, this platform does not replace official medical evaluation.*
