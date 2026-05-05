import { useState, useMemo, useEffect, lazy, Suspense, createContext, useContext } from 'react';
import { Routes, Route, useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ingredientsData from './data/ingredients.json';
import blogData from './data_blog.json';
import './App.css';
import { PrivacyPolicy, TermsAndConditions, AboutPage } from './LegalPages.jsx';
import ContactPage from './ContactPage.jsx';
import DiabeticGuide from './DiabeticGuide.jsx';
import SoupGuide from './SoupGuide.jsx';

const ITEMS_PER_PAGE = 12;
const RecipesContext = createContext(null);

const CATEGORIES = [
  'All',
  'Main Dishes',
  'Desserts',
  'Beverages',
  'Soups & Stews',
  'Salads',
  'Breakfast',
  'Sides',
  'Snacks & Breads',
  'Sauces & Dressings'
];

function useRecipesData() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/recipes-index.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load recipe index');
        return res.json();
      })
      .then(indexData => {
        const totalPages = indexData.totalPages || 15;
        
        const loadPage = (page, accumulated) => {
          if (page > totalPages) {
            setRecipes(accumulated);
            setLoading(false);
            return;
          }
          
          fetch(`/recipes-${page}.json`)
            .then(res => res.json())
            .then(chunk => {
              loadPage(page + 1, [...accumulated, ...chunk]);
            })
            .catch(err => {
              setError(err.message);
              setLoading(false);
            });
        };
        
        loadPage(1, []);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { recipes, loading, error };
}


const slugify = text => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const CATEGORIES_MAP = CATEGORIES.reduce((acc, cat) => {
  acc[slugify(cat)] = cat;
  return acc;
}, {});

const CATEGORY_ICONS = {
  'All': '🍽️',
  'Main Dishes': '🥘',
  'Desserts': '🍰',
  'Beverages': '🥤',
  'Soups & Stews': '🍲',
  'Salads': '🥗',
  'Breakfast': '☀️',
  'Sides': '🫘',
  'Snacks & Breads': '🍞',
  'Sauces & Dressings': '🫙'
};

const CATEGORY_METADATA = {
  'All': {
    title: 'VidaSazón | 700+ Healthy Diabetic-Friendly Recipes',
    description: 'Discover 718 nutritionist-approved recipes designed for people with type 2 diabetes. Flavor without compromise, featuring low GI and fiber-rich meals.'
  },
  'Soups & Stews': {
    title: '20+ Healthy Diabetic Soup Recipes | Low-Carb & Nutritious | VidaSazón',
    description: 'Discover our curated collection of delicious, low-glycemic index soups and stews designed for diabetes management. Easy to cook and full of flavor.'
  },
  'Sides': {
    title: 'Diabetic Side Dish Recipes | Healthy & Low GI Sides | VidaSazón',
    description: 'Complete your meals with our healthy, nutritionist-approved diabetic side dishes. From roasted vegetables to low-carb grains.'
  },
  'Salads': {
    title: 'Fresh Diabetic Salad Recipes | Low-Carb & Nutritious | VidaSazón',
    description: 'Nutritious and refreshing diabetic-friendly salads. Featuring fiber-rich ingredients and healthy dressings for stable blood sugar.'
  },
  'Main Dishes': {
    title: 'Diabetic Main Dish Recipes | Balanced & Healthy Meals | VidaSazón',
    description: 'Flavorful and balanced main courses for diabetic management. Lean proteins and complex carbs for stable energy levels.'
  },
  'Desserts': {
    title: 'Diabetic-Friendly Desserts | Sugar-Free & Low GI Sweets | VidaSazón',
    description: 'Enjoy sweetness without the spike. Our diabetic-friendly desserts use natural sweeteners and fiber-rich ingredients.'
  },
  'Beverages': {
    title: 'Diabetic-Friendly Drink Recipes | Refreshing & Low Sugar | VidaSazón',
    description: 'Stay hydrated with our diabetic-friendly beverage collection. Healthy smoothies, teas, and infused waters without added sugars.'
  }
};

const reveal = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, y: 0,
    transition: { duration: 0.8, ease: [0.19, 1, 0.22, 1] }
  },
  exit: { opacity: 0, y: -15, transition: { duration: 0.3 } }
};

const revealScale = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.7, ease: [0.19, 1, 0.22, 1] }
  }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } }
};

/* ─── Dynamic <head> Manager ─── */
function HeadManager({ title, description, canonical, image }) {
  useEffect(() => {
    if (!title) return;
    document.title = title;

    const canonicalEl = document.querySelector('link[rel="canonical"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    const ogDesc = document.querySelector('meta[name="description"]');
    const ogDescProp = document.querySelector('meta[property="og:description"]');
    const twTitle = document.querySelector('meta[property="twitter:title"]');
    const twDesc = document.querySelector('meta[property="twitter:description"]');
    const ogImage = document.querySelector('meta[property="og:image"]');
    const twImage = document.querySelector('meta[property="twitter:image"]');

    if (ogTitle) ogTitle.content = title;
    if (twTitle) twTitle.content = title;

    if (canonical) {
      let canonicalEl = document.querySelector('link[rel="canonical"]');
      if (!canonicalEl) {
        canonicalEl = document.createElement('link');
        canonicalEl.rel = 'canonical';
        document.head.appendChild(canonicalEl);
      }
      canonicalEl.href = canonical;
      if (ogUrl) ogUrl.content = canonical;
    }

    if (description) {
      const trimmed = description.slice(0, 160);
      if (ogDesc) ogDesc.content = trimmed;
      if (ogDescProp) ogDescProp.content = trimmed;
      if (twDesc) twDesc.content = trimmed;
      
      // Also update standard meta description if it exists
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.content = trimmed;
    }

    if (image) {
      if (ogImage) ogImage.content = image;
      if (twImage) twImage.content = image;
    }

    // Pinterest specific
    const ogSiteName = document.querySelector('meta[property="og:site_name"]');
    if (ogSiteName && !ogSiteName.content) ogSiteName.content = 'VidaSazón';
  }, [title, description, canonical, image]);

  return null;
}

/* ─── Category Schema for filtered views ─── */
function CategorySchema({ category }) {
  const allRecipes = useContext(RecipesContext) || [];
  
  useEffect(() => {
    const baseUrl = window.location.origin;
    const categoryRecipes = allRecipes.filter(r => r.category === category);
    const schema = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": `${category} Recipes | VidaSazón`,
      "description": `Browse ${categoryRecipes.length} diabetic-friendly ${category.toLowerCase()} recipes. All nutritionist-approved, low glycemic index.`,
      "url": `${baseUrl}/category/${category.toLowerCase().replace(' & ', '-').replace(' ', '-')}`,
      "numberOfItems": categoryRecipes.length,
      "itemListElement": categoryRecipes.slice(0, 20).map((r, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "url": `${baseUrl}/recipe/${r.slug}`,
        "name": r.title
      }))
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'category-schema';
    script.textContent = JSON.stringify(schema);
    const existing = document.getElementById('category-schema');
    if (existing) existing.remove();
    document.head.appendChild(script);
    return () => {
      const el = document.getElementById('category-schema');
      if (el) el.remove();
    };
  }, [category]);
  return null;
}

/* ─── Dynamic Recipe JSON-LD Schema ─── */
function RecipeSchema({ recipe }) {
  useEffect(() => {
    if (!recipe) return;
    const baseUrl = window.location.origin;
    const recipeTags = (recipe.tags || []).join(', ');
    const schema = {
      "@context": "https://schema.org",
      "@type": "Recipe",
      "name": recipe.title,
      "url": `${baseUrl}/recipe/${recipe.slug}`,
      "image": recipe.image
        ? `${baseUrl}${recipe.image}`
        : `https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800`,
      "author": {
        "@type": "Organization",
        "name": "VidaSazón",
        "url": "https://vidasazon.com/",
        "description": "Diabetic-friendly recipe platform reviewed by registered dietitians"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Durban University of Technology / VidaSazón",
        "url": "https://vidasazon.com/"
      },
      "description": `${recipe.title} — A diabetic-friendly ${recipe.category.toLowerCase()} recipe with ${recipe.ingredients?.length || 0} ingredients. Serves ${recipe.serves || 'multiple'}. Designed for type 2 diabetes management using low glycemic index ingredients.`,
      "recipeCategory": recipe.category,
      "recipeCuisine": "International",
      "recipeYield": recipe.serves ? `${recipe.serves} servings` : "Multiple servings",
      "recipeIngredient": recipe.ingredients || [],
      "recipeInstructions": (recipe.steps || []).map((step, i) => ({
        "@type": "HowToStep",
        "position": i + 1,
        "text": step,
        "name": `Step ${i + 1}`
      })),
      "keywords": `${recipeTags}, diabetic-friendly recipe, low glycemic index, type 2 diabetes meals, ${recipe.category.toLowerCase()}`,
      "datePublished": "2026-04-24",
      "dateModified": "2026-04-24",
      "nutrition": recipe.nutrition ? {
        "@type": "NutritionInformation",
        "calories": `${recipe.nutrition.calories} calories`,
        "carbohydrateContent": `${recipe.nutrition.carbs} grams`,
        "proteinContent": `${recipe.nutrition.protein} grams`,
        "fatContent": `${recipe.nutrition.fat} grams`,
        "description": `Glycemic Index Score: ${recipe.nutrition.gi_score} (${recipe.nutrition.gi_level})`
      } : {
        "@type": "NutritionInformation",
        "description": "Nutritional values are estimated. Consult a healthcare provider for personalized dietary advice."
      },
      "prepTime": "PT15M",
      "cookTime": "PT30M",
      "totalTime": "PT45M",
      "suitableForDiet": "https://schema.org/DiabeticDiet",
      "about": {
        "@type": "Thing",
        "name": recipe.category,
        "description": "Diabetic-friendly recipe category"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "12",
        "bestRating": "5"
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${baseUrl}/recipe/${recipe.slug}`
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'recipe-schema';
    script.textContent = JSON.stringify(schema);

    const existing = document.getElementById('recipe-schema');
    if (existing) existing.remove();

    document.head.appendChild(script);

    return () => {
      const el = document.getElementById('recipe-schema');
      if (el) el.remove();
    };
  }, [recipe]);

  return null;
}

/* ─── Breadcrumb JSON-LD Schema ─── */
function BreadcrumbSchema({ category, recipe }) {
  useEffect(() => {
    const baseUrl = window.location.origin;
    const items = [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${baseUrl}/`
      }
    ];

    if (category && category !== 'All') {
      items.push({
        "@type": "ListItem",
        "position": items.length + 1,
        "name": category,
        "item": `${baseUrl}/category/${slugify(category)}`
      });
    }

    if (recipe) {
      if (!category) {
        items.push({
          "@type": "ListItem",
          "position": items.length + 1,
          "name": recipe.category,
          "item": `${baseUrl}/category/${slugify(recipe.category)}`
        });
      }
      items.push({
        "@type": "ListItem",
        "position": items.length + 1,
        "name": recipe.title,
        "item": `${baseUrl}/recipe/${recipe.slug}`
      });
    }

    if (items.length === 1) {
      items.push({
        "@type": "ListItem",
        "position": 2,
        "name": "Recipes",
        "item": `${baseUrl}/#recipes`
      });
    }

    const schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'breadcrumb-schema';
    script.textContent = JSON.stringify(schema);
    
    const existing = document.getElementById('breadcrumb-schema');
    if (existing) existing.remove();
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById('breadcrumb-schema');
      if (el) el.remove();
    };
  }, [category, recipe]);

  return null;
}

/* ─── ItemList Schema for Collection ─── */
function CollectionSchema({ recipes }) {
  useEffect(() => {
    const baseUrl = window.location.origin;
    const schema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "VidaSazón Diabetic-Friendly Recipes",
      "description": `Browse ${recipes.length} nutritionist-approved diabetic-friendly recipes across 9 categories. All recipes designed for type 2 diabetes management using low glycemic index ingredients.`,
      "numberOfItems": recipes.length,
      "itemListElement": recipes.slice(0, 100).map((r, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "url": `${baseUrl}/recipe/${r.slug}`,
        "name": r.title,
        "description": `${r.title} — ${r.category} recipe with ${r.ingredients?.length || 0} ingredients`
      }))
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'collection-schema';
    script.textContent = JSON.stringify(schema);

    const existing = document.getElementById('collection-schema');
    if (existing) existing.remove();

    document.head.appendChild(script);

    return () => {
      const el = document.getElementById('collection-schema');
      if (el) el.remove();
    };
  }, [recipes]);
  return null;
}

/* ─── Pinterest Share Button ─── */
function PinterestShare({ recipe, vertical = false }) {
  const handlePin = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const baseUrl = window.location.origin;
    const url = encodeURIComponent(`${baseUrl}/recipe/${recipe.slug}`);
    const media = encodeURIComponent(`${baseUrl}${recipe.image}`);
    const description = encodeURIComponent(`${recipe.title} - Receta saludable para diabéticos (Bajo IG). ¡Descubre más de 700 recetas en VidaSazón! #diabetic-friendly #lowgi #vidasazon`);
    
    window.open(
      `https://www.pinterest.com/pin/create/button/?url=${url}&media=${media}&description=${description}`,
      'Pinterest',
      'width=750,height=600'
    );
  };

  return (
    <button 
      className={`pinterest-share-btn ${vertical ? 'vertical' : ''}`} 
      onClick={handlePin}
      aria-label="Pin on Pinterest"
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M12.289 2C6.617 2 2 6.617 2 12.289c0 4.305 2.654 8.01 6.452 9.563-.09-.806-.17-2.046.035-2.928.185-.792 1.192-5.05 1.192-5.05s-.304-.608-.304-1.506c0-1.41.817-2.463 1.834-2.463.865 0 1.282.648 1.282 1.427 0 .87-.553 2.167-.84 3.37-.24.101-.424.33-.217.61.025.04.05.07.078.1.58.583 1.62.774 2.508.774 3.011 0 5.32-3.178 5.32-7.766 0-4.06-2.916-6.896-7.082-6.896-4.819 0-7.648 3.614-7.648 7.348 0 1.455.56 3.015 1.26 3.865.138.168.158.316.117.485l-.467 1.905c-.075.31-.25.375-.575.225-2.148-1-3.49-4.145-3.49-6.666 0-5.426 3.94-10.41 11.36-10.41 5.965 0 10.6 4.25 10.6 9.932 0 5.925-3.736 10.692-8.92 10.692-1.742 0-3.38-.905-3.94-1.98l-1.072 4.092c-.39 1.488-1.442 3.356-2.145 4.5l.394.07c5.845.54 11.196-3.14 13.06-8.58.118-.34.195-.542.195-.542s2.008-7.77 2.05-7.94c.04-.17.155-.572.066-.757-.09-.185-.506-.271-.703-.298-.2-.027-.852.126-.852.126s-1.84 4.032-2.145 4.5c-.305.467-.78 1.054-1.488.941-.708-.113-.984-.962-.904-1.85.08-.888.543-3.66.543-3.66s.184-.954-.15-1.503c-.333-.55-.984-.664-1.48-.616-.5.05-1.033.352-1.25.753-.217.4-.184 1.255.08 1.83l.83 1.808c.118.256.096.386-.101.558-.2.172-.61.127-.872-.083a2.383 2.383 0 0 1-.397-.506c-.52-.806-.71-1.734-.5-2.658.21-.924.81-1.68 1.63-2.055.82-.375 1.764-.325 2.545.138.78.463 1.254 1.298 1.254 2.213z" />
      </svg>
      <span>Save</span>
    </button>
  );
}

/* ─── Recipe Detail Page (full route /recipe/:slug) ─── */
function RecipePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const recipe = useContext(RecipesContext)?.find(r => r.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!recipe) {
    return (
      <div className="App">
        <SiteHeader />
        <main className="container">
          <div className="empty-state" style={{ paddingTop: '6rem' }}>
            <p>Recipe not found.</p>
            <button onClick={() => navigate('/')}>Back to Cookbook</button>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const baseUrl = window.location.origin;

  return (
    <div className="App">
      <HeadManager
        title={`${recipe.title} | ${recipe.category} | VidaSazón`}
        description={`${recipe.title} - Diabetic-friendly ${recipe.category.toLowerCase()} recipe. ${recipe.ingredients?.length || 0} ingredients, serves ${recipe.serves || 'multiple'}. Low GI meal for type 2 diabetes management.`}
        canonical={`${baseUrl}/recipe/${recipe.slug}`}
        image={recipe.image ? `${baseUrl}${recipe.image}` : `https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800`}
      />
      <RecipeSchema recipe={recipe} />
      <BreadcrumbSchema recipe={recipe} />

      <SiteHeader />

      <main className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-sep">›</span>
          <Link to="/">Recipes</Link>
          <span className="breadcrumb-sep">›</span>
          <span>{recipe.category}</span>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-current">{recipe.title}</span>
        </nav>

        <motion.article
          className="recipe-detail"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
        >
          <div className="recipe-detail-hero">
            {recipe.image ? (
              <>
                <img 
                  src={recipe.image} 
                  alt={`${recipe.title} - ${recipe.category} recipe`} 
                  width="800" height="450" 
                  data-pin-media={`${baseUrl}${recipe.image}`}
                  data-pin-description={`${recipe.title} — Receta de ${recipe.category} apta para diabéticos. Descubre más en VidaSazón.`}
                  data-pin-url={`${baseUrl}/recipe/${recipe.slug}`}
                />
                <div className="hero-pin-overlay">
                  <PinterestShare recipe={recipe} />
                </div>
              </>
            ) : (
              <div className="modal-placeholder-img" role="img" aria-label={`${recipe.title} - ${recipe.category} diabetic-friendly recipe`}>
                <span aria-hidden="true">{CATEGORY_ICONS[recipe.category] || '🍽️'}</span>
              </div>
            )}
          </div>

          <div className="recipe-detail-body">
            <span className="label-upper modal-category">{recipe.category}</span>
            <h1 className="recipe-detail-title">{recipe.title}</h1>
            <p className="recipe-byline">Reviewed by DUT Food &amp; Nutrition Dept &bull; Durban University of Technology</p>

            <p className="recipe-intro">
              This diabetic-friendly <strong>{recipe.category.toLowerCase()}</strong> recipe is part of VidaSaz&#243;n&apos;s collection of 718 nutritionist-approved meals designed for type 2 diabetes management. Featuring {recipe.ingredients?.length || 0} simple ingredients, it delivers full flavor while supporting stable blood sugar levels through low glycemic index cooking.
            </p>

            <p className="modal-serves">Servings: {recipe.serves || 'Multiple'}</p>

            {recipe.nutrition && (
              <div className="nutrition-panel">
                <div className="nutrition-header">
                  <h3>Nutrition Profile</h3>
                  <span className={`gi-badge gi-${recipe.nutrition.gi_level.toLowerCase()}`}>
                    GI: {recipe.nutrition.gi_score} ({recipe.nutrition.gi_level})
                  </span>
                </div>
                <div className="nutrition-stats">
                  <div className="stat-box">
                    <span className="stat-value">{recipe.nutrition.calories}</span>
                    <span className="stat-label">Calories</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-value">{recipe.nutrition.carbs}g</span>
                    <span className="stat-label">Carbs</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-value">{recipe.nutrition.protein}g</span>
                    <span className="stat-label">Protein</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-value">{recipe.nutrition.fat}g</span>
                    <span className="stat-label">Fat</span>
                  </div>
                </div>
                <p className="nutrition-disclaimer">* Estimated per serving. Values may vary based on exact brands used.</p>
              </div>
            )}

            <div className="recipe-detail-grid">
              <div className="modal-section">
                <h2>Ingredients</h2>
                <ul className="ingredient-list single-col">
                  {recipe.ingredients?.map((ing, i) => (
                    <li key={i}>{ing}</li>
                  ))}
                </ul>
              </div>

              <div className="modal-section">
                <h2>Directions</h2>
                <ol className="steps-list">
                  {recipe.steps?.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>

            {recipe.tags && recipe.tags.length > 0 && (
              <div className="modal-tags" role="list" aria-label="Recipe tags">
                {recipe.tags.map((tag, i) => (
                  <span key={i} className="tag" role="listitem">{tag}</span>
                ))}
              </div>
            )}

            {(() => {
              const allRecipes = useContext(RecipesContext) || [];
              const related = allRecipes
                .filter(r => r.category === recipe.category && r.slug !== recipe.slug)
                .slice(0, 4);
              if (related.length === 0) return null;
              return (
                <div className="related-recipes">
                  <h3>You Might Also Like</h3>
                  <div className="related-grid">
                    {related.map(r => (
                      <Link key={r.slug} to={`/recipe/${r.slug}`} className="related-card">
                        <span className="related-icon" aria-hidden="true">{CATEGORY_ICONS[r.category] || '🍽️'}</span>
                        <span className="related-title">{r.title}</span>
                        <span className="related-meta">{r.serves ? `Serves ${r.serves}` : r.category}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })()}

            <div className="recipe-detail-back">
              <Link to="/" className="cta-button label-upper">&#8592; Back to Cookbook</Link>
            </div>
          </div>
        </motion.article>
      </main>

      <SiteFooter />
    </div>
  );
}

/* ─── Recipe Card ─── */
function RecipeCard({ recipe }) {
  return (
    <motion.article 
      className="recipe-card"
      variants={revealScale}
      whileHover={{ y: -8, transition: { duration: 0.4, ease: [0.19, 1, 0.22, 1] } }}
      layout
    >
      <Link to={`/recipe/${recipe.slug}`} className="recipe-card-link">
        <div className="recipe-image">
          {recipe.image ? (
            <>
              <img src={recipe.image} alt={recipe.title} loading="lazy" />
              <div className="card-pin-overlay">
                <PinterestShare recipe={recipe} vertical />
              </div>
            </>
          ) : (
            <div className="placeholder-img" role="img" aria-label={`Placeholder illustration for ${recipe.title}`}>
              <span className="placeholder-icon">{CATEGORY_ICONS[recipe.category] || '🍽️'}</span>
              <span className="placeholder-text">{recipe.category}</span>
            </div>
          )}
        </div>
        <div className="recipe-card-body">
          <span className="label-upper recipe-category-tag">{recipe.category}</span>
          <h3>{recipe.title}</h3>
          <p className="recipe-serves">{recipe.serves ? `Serves ${recipe.serves}` : ''}</p>
        </div>
      </Link>
    </motion.article>
  );
}

/* ─── Shared Header ─── */
export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header>
      <div className="container header-inner">
        <Link to="/" className="logo">Vida<span>Sazón</span></Link>
        
        <button 
          className={`menu-toggle ${isMenuOpen ? 'active' : ''}`} 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={isMenuOpen ? 'nav-mobile-open' : ''}>
          <ul className="nav-links label-upper">
            <li><Link to="/">Recipes</Link></li>
            <li><Link to="/discovery" style={{ color: 'var(--spice)', fontWeight: 'bold' }}>Chef Discovery</Link></li>
            <li><Link to="/about">Our Mission</Link></li>
            <li><Link to="/diabetic-food-guide">Food Guide</Link></li>
            <li><Link to="/contact">Contact Support</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

/* ─── Shared Footer ─── */
export function SiteFooter() {
  return (
    <footer>
      <div className="container footer-grid">
        <div>
          <Link to="/" className="logo" style={{ color: 'white', marginBottom: '2rem', display: 'block' }}>Vida<span>Sazón</span></Link>
          <p className="footer-text">An initiative dedicated to preserving Latin flavor in the face of the type 2 diabetes challenge.</p>
          <p className="footer-attribution">
            Recipe data sourced from the <a href="https://huggingface.co/datasets/Ashikan/diabetic-friendly-recipes" target="_blank" rel="noopener noreferrer">DUT Diabetic Friendly Recipes dataset</a>
            <br/>Developed by Prof. Ashika Naicker, Mr. Shaylin Chetty, Ms. Riashnie Thaver, Ms. Anjellah Reddy, Dr. Evonne Shanita Singh, Dr. Imana Pal, Dr. Lisebo Mothepu
            <br/>Durban University of Technology, Faculty of Applied Sciences, Department of Food and Nutrition, Durban, South Africa
            <br/>Licensed under <a href="https://opensource.org/licenses/AFL-3.0" target="_blank" rel="noopener noreferrer">AFL-3.0</a>
          </p>
        </div>
        <div className="label-upper footer-links">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms & Conditions</Link>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span className="label-upper">© 2026 VidaSazón</span>
        </div>
      </div>
    </footer>
  );
}
const COMMON_INGREDIENTS = ["garlic", "onion", "olive oil", "tomatoes", "eggs", "chicken breast", "parsley", "ginger", "coriander", "lemon juice", "black pepper", "spinach", "red onion", "carrots", "potatoes", "bell pepper", "yoghurt", "milk", "cinnamon", "avocado"];

/* ─── Discovery Page — Chef de lo que tengo ─── */
function DiscoveryPage() {
  const allRecipes = useContext(RecipesContext) || [];
  const [availableIngredients] = useState(ingredientsData);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    // Ingredients are now imported directly
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    
    // If user types a comma, add the current value as an ingredient
    if (val.endsWith(',')) {
      const cleanVal = val.slice(0, -1).trim();
      if (cleanVal) addIngredient(cleanVal);
      return;
    }

    setInputValue(val);
    if (val.trim().length > 1) {
      const filtered = availableIngredients
        .filter(ing => ing.toLowerCase().includes(val.toLowerCase()) && !selectedIngredients.some(si => si.toLowerCase() === ing.toLowerCase()))
        .slice(0, 8);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    const items = paste.split(/[,|\n]/).map(i => i.trim()).filter(i => i);
    items.forEach(item => addIngredient(item));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
      addIngredient(suggestions[0]);
    } else if (e.key === 'Enter' && inputValue.trim()) {
      // If no suggestion but something is typed, add it as a custom chip
      addIngredient(inputValue.trim());
    }
  };

  const addIngredient = (ing) => {
    const normalized = ing.toLowerCase().trim();
    if (normalized && !selectedIngredients.some(i => i.toLowerCase() === normalized)) {
      setSelectedIngredients([...selectedIngredients, ing]);
    }
    setInputValue('');
    setSuggestions([]);
  };

  const removeIngredient = (ing) => {
    setSelectedIngredients(selectedIngredients.filter(i => i !== ing));
  };

  const matchedRecipes = useMemo(() => {
    if (selectedIngredients.length === 0) return [];

    return allRecipes
      .map(recipe => {
        const recipeTags = (recipe.tags || []).map(t => t.toLowerCase());
        const recipeIngs = (recipe.ingredients || []).map(i => i.toLowerCase());
        
        const matchedDetails = selectedIngredients.filter(ing => {
          const q = ing.toLowerCase().trim();
          const qSingular = q.endsWith('s') ? q.slice(0, -1) : q;
          
          return recipeTags.some(t => t.includes(q) || t.includes(qSingular)) ||
                 recipeIngs.some(i => i.includes(q) || i.includes(qSingular));
        });
        
        const score = matchedDetails.length / selectedIngredients.length;
        return { ...recipe, matchCount: matchedDetails.length, matchScore: score, matchedNames: matchedDetails };
      })
      .filter(r => r.matchCount > 0)
      .sort((a, b) => b.matchScore - a.matchScore || b.matchCount - a.matchCount)
      .slice(0, 24);
  }, [selectedIngredients, allRecipes]);

  const [isAlphabeticalOpen, setIsAlphabeticalOpen] = useState(false);

  const groupedIngredients = useMemo(() => {
    const groups = {};
    if (!availableIngredients || !Array.isArray(availableIngredients)) return {};
    
    availableIngredients.forEach(ing => {
      if (!ing || typeof ing !== 'string') return;
      const firstChar = ing.trim().charAt(0).toUpperCase();
      const letter = /[A-Z]/.test(firstChar) ? firstChar : '#';
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(ing);
    });
    return Object.keys(groups).sort().reduce((acc, key) => {
      acc[key] = groups[key].sort();
      return acc;
    }, {});
  }, [availableIngredients]);

  return (
    <div className="App">
      <HeadManager 
        title="Chef Discovery | What can I cook with these ingredients? | VidaSazón"
        description="Select the ingredients you have and find the best diabetic-friendly recipes. Our 'Chef Discovery' tool helps you cook healthy meals with what's in your fridge."
        canonical="https://vidasazon.com/discovery"
      />
      <SiteHeader />

      <main className="container">
        <section className="discovery-hero">
          <motion.div variants={reveal} initial="hidden" animate="visible">
            <span className="label-upper section-label">Discovery Tool</span>
            <h1>What&apos;s in your <span>fridge</span>?</h1>
            <p className="hero-subtitle">Enter the ingredients you have on hand and we&apos;ll find the best nutritionist-approved recipes for you.</p>
          </motion.div>
        </section>

        <section className="ingredient-selector">
          <div className="discovery-input-wrapper">
            <input 
              type="text" 
              className="discovery-search-input"
              placeholder="Type an ingredient (e.g. Chicken) and press Enter..."
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
            />
            <p className="input-hint">Add ingredients one by one or paste a list separated by commas.</p>
            {suggestions.length > 0 && (
              <div className="suggestions-dropdown">
                {suggestions.map(s => (
                  <div key={s} className="suggestion-item" onClick={() => addIngredient(s)}>
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="selected-ingredients">
            <AnimatePresence>
              {selectedIngredients.map(ing => (
                <motion.span 
                  key={ing} 
                  className="ingredient-chip selected"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                >
                  {ing}
                  <button className="remove-chip" onClick={() => removeIngredient(ing)} aria-label={`Remove ${ing}`}>&times;</button>
                </motion.span>
              ))}
            </AnimatePresence>
          </div>

          <div className="popular-ingredients">
            <span className="label-upper" style={{ fontSize: '0.65rem', display: 'block', marginBottom: '1rem', opacity: 0.7 }}>Common Ingredients</span>
            <div className="popular-grid">
              {COMMON_INGREDIENTS.filter(ing => !selectedIngredients.some(si => si.toLowerCase() === ing.toLowerCase())).map(ing => (
                <button 
                  key={ing} 
                  className="popular-chip"
                  onClick={() => addIngredient(ing)}
                >
                  + {ing}
                </button>
              ))}
              <button 
                className="popular-chip browse-all-btn" 
                onClick={() => setIsAlphabeticalOpen(!isAlphabeticalOpen)}
              >
                {isAlphabeticalOpen ? '− Close A-Z List' : '+ Browse All A-Z'}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {isAlphabeticalOpen && (
              <motion.div 
                className="alphabetical-browse"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
              >
                <div className="alphabetical-container">
                  {Object.entries(groupedIngredients).map(([letter, items]) => (
                    <div key={letter} className="alphabetical-group">
                      <div className="letter-header">{letter}</div>
                      <div className="letter-items">
                        {items.filter(ing => !selectedIngredients.some(si => si.toLowerCase() === ing.toLowerCase())).map(ing => (
                          <span key={ing} className="browse-item" onClick={() => addIngredient(ing)}>
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <section className="discovery-results">
          {selectedIngredients.length > 0 && (
            <div className="discovery-results-header">
              <h2>Recommended for you ({matchedRecipes.length})</h2>
              <span className="label-upper" style={{ fontSize: '0.7rem' }}>Ranked by Match Score</span>
            </div>
          )}

          {matchedRecipes.length > 0 ? (
            <motion.div className="recipes-grid" initial="hidden" animate="visible" variants={stagger}>
              {matchedRecipes.map(recipe => (
                <div key={recipe.id} className="discovery-card-wrapper">
                  <RecipeCard recipe={recipe} />
                  <div className="discovery-badge-container">
                    <span className="match-score">
                      {Math.round(recipe.matchScore * 100)}% Match
                    </span>
                  </div>
                  <div className="discovery-match-info">
                    <span className="match-label label-upper">Matches:</span>
                    <span className="match-list">{recipe.matchedNames.join(', ')}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : selectedIngredients.length > 0 ? (
            <div className="empty-state">
              <p>No recipes found with those specific ingredients. Try removing some or adding alternatives.</p>
            </div>
          ) : (
            <div className="empty-state" style={{ opacity: 0.5 }}>
              <p>Add some ingredients above to see recommendations.</p>
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

/* ─── Home Page ─── */
function HomePage() {
  const { catSlug } = useParams();
  const activeCategory = catSlug && CATEGORIES_MAP[catSlug] ? CATEGORIES_MAP[catSlug] : 'All';

  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  useEffect(() => {
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://images.unsplash.com';
    document.head.appendChild(preconnect);
    return () => { document.head.removeChild(preconnect); };
  }, []);

  const allRecipes = useContext(RecipesContext) || [];

  const filteredRecipes = useMemo(() => {
    let result = allRecipes;

    if (activeCategory !== 'All') {
      result = result.filter(r => r.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const terms = searchQuery.toLowerCase().split(',').map(t => t.trim()).filter(t => t);
      result = result.filter(r => {
        return terms.every(term => 
          r.title.toLowerCase().includes(term) ||
          r.tags?.some(t => t.toLowerCase().includes(term)) ||
          r.category.toLowerCase().includes(term) ||
          r.ingredients?.some(ing => ing.toLowerCase().includes(term))
        );
      });
    }

    return result;
  }, [activeCategory, searchQuery, allRecipes]);

  const visibleRecipes = filteredRecipes.slice(0, visibleCount);
  const hasMore = visibleCount < filteredRecipes.length;

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const loadMore = () => {
    setVisibleCount(prev => prev + ITEMS_PER_PAGE);
  };

  return (
    <div className="App">
      <HeadManager 
        title={CATEGORY_METADATA[activeCategory]?.title || `Easy Diabetic ${activeCategory} Recipes | VidaSazón`}
        description={CATEGORY_METADATA[activeCategory]?.description || `Explore our delicious, nutritionist-approved diabetic-friendly ${activeCategory.toLowerCase()} recipes. Fast, easy, and healthy.`}
        canonical={activeCategory === 'All' ? 'https://vidasazon.com/' : `https://vidasazon.com/category/${slugify(activeCategory)}`}
      />
      <CollectionSchema recipes={filteredRecipes} />
      {activeCategory !== 'All' && <CategorySchema category={activeCategory} />}
      <BreadcrumbSchema category={activeCategory} />

      <SiteHeader />

      <main className="container">
        {/* ── Hero ── */}
        <motion.section
          className="hero"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.div className="hero-text" variants={reveal}>
            <span className="label-upper section-label">Wellness Edition 2026</span>
            <h1>The Flavor that <br/><span>Rewrites</span> your Health.</h1>
            <p className="hero-subtitle">
              718 nutritionist-approved recipes, designed for people with type 2 diabetes.
              Flavor without compromise.
            </p>
            <a href="#recipes" className="cta-button label-upper">
              Explore {(useContext(RecipesContext) || []).length} Recipes
            </a>
          </motion.div>

          <motion.div className="hero-image-wrapper" variants={reveal}>
            <img
              src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=1200"
              alt="Healthy ingredients for diabetic-friendly cooking: fresh vegetables, lean proteins, and whole grains on a rustic table"
              className="hero-img"
              width="1200"
              height="800"
              fetchPriority="high"
            />
          </motion.div>
        </motion.section>

        {/* ── Ad Sponsorship ── */}
        <section className="ad-sponsorship">
          <span className="label-upper">Strategic Partner</span>
          <h4>Promoting a fulfilling life through mindful nutrition.</h4>
        </section>

        {/* ── Recipe Browser ── */}
        <section id="recipes" className="recipe-browser" aria-label="Recipe browser">
          <div className="browser-header">
            <div>
              <span className="label-upper section-label">Culinary Archive</span>
              <h2 className="browser-title">Our Cookbook</h2>
            </div>
            <div className="search-wrapper">
              <label htmlFor="recipe-search" className="sr-only">Search recipes or ingredients</label>
              <input
                type="search"
                placeholder="Search recipes or ingredients..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="search-input"
                id="recipe-search"
              />
            </div>
          </div>

          {/* Category Filters */}
          <nav className="category-filters" role="navigation" aria-label="Recipe categories">
            {CATEGORIES.map(cat => (
              <Link
                key={cat}
                to={cat === 'All' ? '/' : `/category/${slugify(cat)}`}
                className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => {
                  setVisibleCount(ITEMS_PER_PAGE);
                  setSearchQuery('');
                }}
                aria-pressed={activeCategory === cat}
                aria-label={`Filter by ${cat}`}
              >
                <span className="cat-icon" aria-hidden="true">{CATEGORY_ICONS[cat]}</span>
                <span>{cat}</span>
              </Link>
            ))}
          </nav>

          {/* Results Count */}
          <p className="results-count" role="status" aria-live="polite">
            {(() => {
              const allRecipes = useContext(RecipesContext) || [];
              const total = allRecipes.length;
              const shown = filteredRecipes.length;
              return shown === total
                ? `Showing all ${total} recipes`
                : `${shown} recipe${shown !== 1 ? 's' : ''} in ${activeCategory}${searchQuery ? ` matching "${searchQuery}"` : ''}`;
            })()}
          </p>

          {/* Recipe Grid */}
          <motion.div
            className="recipes-grid"
            initial="hidden"
            animate="visible"
            variants={stagger}
            role="list"
            aria-label="Recipe list"
          >
            <AnimatePresence mode="popLayout">
              {visibleRecipes.map(recipe => (
                <div key={recipe.id} role="listitem">
                  <RecipeCard recipe={recipe} />
                </div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Load More */}
          {hasMore && (
            <div className="load-more-wrapper">
              <button className="load-more-btn" onClick={loadMore} aria-label={`Load more recipes. ${filteredRecipes.length - visibleCount} remaining`}>
                Load more recipes ({filteredRecipes.length - visibleCount} remaining)
              </button>
            </div>
          )}

          {filteredRecipes.length === 0 && (
            <div className="empty-state" role="alert">
              <p>No recipes found matching that criteria.</p>
              <button onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}>
                View all
              </button>
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

/* ─── Blog Pages ─── */
function BlogIndex() {
  // Separate the first post as "Featured" and the rest as regular items
  const featuredPost = blogData[0];
  const remainingPosts = blogData.slice(1);

  return (
    <div className="App">
      <HeadManager 
        title="VidaSazón Nutrition Blog | Diabetic-Friendly Articles"
        description="Read our latest articles on managing type 2 diabetes through nutrition, healthy eating tips, and dietary guides."
        canonical="https://vidasazon.com/blog"
      />
      <SiteHeader />
      
      <main className="container" style={{ padding: '6rem 0' }}>
        <section className="discovery-hero" style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <span className="label-upper section-label" style={{ paddingLeft: '0', display: 'inline-block' }}>Apothecary & Wellness</span>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', margin: '1rem 0' }}>Nutrition <span>Blog</span></h1>
          <p className="hero-subtitle" style={{ margin: '0 auto', maxWidth: '600px' }}>
            Culinary guides, dietary insights, and wholesome wellness tips for type 2 diabetes management and healthy living.
          </p>
        </section>

        {/* Featured Post */}
        {featuredPost && (
          <section className="blog-featured-section">
            <span className="label-upper" style={{ display: 'block', marginBottom: '1.5rem', opacity: 0.8 }}>Featured Insight</span>
            <Link to={`/blog/${featuredPost.slug}`} className="blog-featured-card">
              <div className="blog-featured-img-wrapper">
                {/* Vintage botanical abstract illustration */}
              </div>
              <div className="blog-featured-body">
                <div className="blog-meta-row">
                  <span className="blog-meta-date">{featuredPost.date || 'Article'}</span>
                  <span className="blog-meta-author">{featuredPost.author || 'VidaSazón Team'}</span>
                </div>
                <h2 className="blog-card-title" style={{ fontSize: '2.2rem', marginBottom: '1.5rem' }}>
                  {featuredPost.title}
                </h2>
                <p className="blog-card-excerpt" style={{ fontSize: '1.05rem', marginBottom: '2.5rem' }}>
                  {featuredPost.excerpt}
                </p>
                <div className="blog-card-btn">
                  Read Full Article <span>&#8594;</span>
                </div>
              </div>
            </Link>
          </section>
        )}
        
        {/* Regular Posts Grid */}
        <div>
          {blogData.length > 0 ? (
            <>
              {remainingPosts.length > 0 && (
                <span className="label-upper" style={{ display: 'block', marginBottom: '2rem', opacity: 0.8 }}>Latest Publications</span>
              )}
              <div className="blog-grid-modern">
                {remainingPosts.map(post => (
                  <Link to={`/blog/${post.slug}`} key={post.slug} className="blog-post-card">
                    <div className="blog-card-img-holder"></div>
                    <div className="blog-card-content">
                      <div className="blog-meta-row">
                        <span className="blog-meta-date">{post.date || 'Article'}</span>
                        <span className="blog-meta-author">{post.author || 'VidaSazón Team'}</span>
                      </div>
                      <h3 className="blog-card-title">{post.title}</h3>
                      <p className="blog-card-excerpt">{post.excerpt}</p>
                      <div className="blog-card-btn" style={{ marginTop: 'auto' }}>
                        Read Article <span>&#8594;</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state">No articles published yet. Check back soon!</div>
          )}
        </div>
      </main>
      
      <SiteFooter />
    </div>
  );
}

function ArticlePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const article = blogData.find(b => b.slug === slug);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll Progress Tracker
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.pageYOffset / totalScroll) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!article) {
    return (
      <div className="App">
        <SiteHeader />
        <main className="container">
          <div className="empty-state" style={{ paddingTop: '6rem' }}>
            <p>Article not found.</p>
            <button onClick={() => navigate('/blog')}>Back to Blog</button>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const baseUrl = window.location.origin;

  return (
    <div className="App">
      <HeadManager
        title={`${article.title} | VidaSazón Blog`}
        description={article.excerpt}
        canonical={`${baseUrl}/blog/${article.slug}`}
      />
      
      {/* Reading Progress Bar */}
      <div className="reading-progress-bar" style={{ width: `${scrollProgress}%` }}></div>

      <SiteHeader />

      <main className="container" style={{ padding: '4rem 0 8rem' }}>
        <nav className="breadcrumb" aria-label="Breadcrumb" style={{ marginBottom: '3rem' }}>
          <Link to="/">Home</Link>
          <span className="breadcrumb-sep">›</span>
          <Link to="/blog">Blog</Link>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-current">{article.title}</span>
        </nav>

        <article className="article-container-premium">
          <header className="article-header">
            <div className="article-meta-badge">
              {article.date || 'Article'} • {article.author || 'VidaSazón Nutrition Team'}
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 5.5vw, 3.4rem)', lineHeight: '1.15', margin: '1rem 0' }}>
              {article.title}
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontFamily: 'Playfair Display', fontStyle: 'italic', maxWidth: '640px', margin: '1.5rem auto 0', lineHeight: '1.5' }}>
              {article.excerpt}
            </p>
          </header>

          {/* Interactive drop cap paragraph */}
          <div 
            className="article-content-premium" 
            dangerouslySetInnerHTML={{ __html: article.contentHtml }} 
          />
          
          {article.tags && article.tags.length > 0 && (
            <div className="modal-tags" style={{ marginTop: '4rem', padding: '2rem 0', borderTop: '1px solid rgba(26, 47, 35, 0.08)' }}>
              <span className="label-upper" style={{ display: 'block', marginBottom: '1rem', opacity: 0.6 }}>Tags</span>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                {article.tags.map(tag => (
                  <span key={tag} className="tag" style={{ background: 'var(--canvas-warm)', border: 'none', color: 'var(--sage)' }}>{tag}</span>
                ))}
              </div>
            </div>
          )}


          
          <div style={{ marginTop: '5rem', textAlign: 'center' }}>
            <Link to="/blog" className="cta-button label-upper" style={{ borderRadius: '100px' }}>
              &#8592; Back to Nutrition Blog
            </Link>
          </div>
        </article>
      </main>
      
      <SiteFooter />
    </div>
  );
}

/* ─── App with Routes ─── */
function App() {
  const { recipes, loading, error } = useRecipesData();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f8f9fa' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🍽️</div>
          <div style={{ color: '#666' }}>Loading recipes...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f8f9fa' }}>
        <div style={{ textAlign: 'center', color: '#c00' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</div>
          <div>Error loading recipes</div>
          <div style={{ fontSize: '0.875rem', color: '#666' }}>{error}</div>
        </div>
      </div>
    );
  }

  if (!recipes) return null;

  return (
    <RecipesContext.Provider value={recipes}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:catSlug" element={<HomePage />} />
        <Route path="/recipe/:slug" element={<RecipePage />} />
        <Route path="/discovery" element={<DiscoveryPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<><HeadManager title="Privacy Policy | VidaSazón" description="VidaSazón privacy policy. Learn how we collect, use, and protect your personal information. We are committed to data security and transparency." canonical="https://vidasazon.com/privacy" /><SiteHeader /><PrivacyPolicy /><SiteFooter /></>} />
        <Route path="/terms" element={<><HeadManager title="Terms &amp; Conditions | VidaSazón" description="VidaSazón terms and conditions. Read about our medical disclaimer, recipe data attribution, user conduct, and limitation of liability." canonical="https://vidasazon.com/terms" /><SiteHeader /><TermsAndConditions /><SiteFooter /></>} />
        <Route path="/about" element={<><HeadManager title="About VidaSazón | Academic Recipe Platform" description="Learn about VidaSazón's 718 dietitian-approved diabetic-friendly recipes sourced from Durban University of Technology. Meet our team and mission." canonical="https://vidasazon.com/about" /><SiteHeader /><AboutPage /><SiteFooter /></>} />
        <Route path="/diabetic-food-guide" element={<><HeadManager title="Diabetic Food Guide | Nutrition Tips &amp; Recipes | VidaSazón" description="Comprehensive guide for diabetic-friendly eating. Learn about low GI foods, fiber-rich diets, and healthy meal planning for type 2 diabetes." canonical="https://vidasazon.com/diabetic-food-guide" /><DiabeticGuide /></>} />
        <Route path="/diabetic-soup-guide" element={<><HeadManager title="Healthy Diabetic Soup Guide | Low-Carb Soup Tips | VidaSazón" description="The ultimate guide to diabetic-friendly soups. Learn why soups are great for blood sugar and how to choose the best recipes for type 2 diabetes." canonical="https://vidasazon.com/diabetic-soup-guide" /><SoupGuide /></>} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:slug" element={<ArticlePage />} />
      </Routes>
    </RecipesContext.Provider>
  );
}

export default App;
