import { useState, useMemo, useEffect, lazy, Suspense, createContext, useContext } from 'react';
import { Routes, Route, useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import { PrivacyPolicy, TermsAndConditions, AboutPage } from './LegalPages.jsx';
import ContactPage from './ContactPage.jsx';

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
      if (canonicalEl) canonicalEl.href = canonical;
      if (ogUrl) ogUrl.content = canonical;
    }

    if (description) {
      const trimmed = description.slice(0, 160);
      if (ogDesc) ogDesc.content = trimmed;
      if (ogDescProp) ogDescProp.content = trimmed;
      if (twDesc) twDesc.content = trimmed;
    }

    if (image) {
      if (ogImage) ogImage.content = image;
      if (twImage) twImage.content = image;
    }
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
              <img src={recipe.image} alt={`${recipe.title} - ${recipe.category} recipe`} width="800" height="450" />
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
            <img src={recipe.image} alt={recipe.title} loading="lazy" />
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
function SiteHeader() {
  return (
    <header>
      <div className="container header-inner">
        <Link to="/" className="logo">Vida<span>Sazón</span></Link>
        <nav>
          <ul className="nav-links label-upper">
            <li><Link to="/">Recipes</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

/* ─── Shared Footer ─── */
function SiteFooter() {
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
      const q = searchQuery.toLowerCase();
      result = result.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.tags?.some(t => t.toLowerCase().includes(q)) ||
        r.category.toLowerCase().includes(q) ||
        r.ingredients?.some(ing => ing.toLowerCase().includes(q))
      );
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
        title={activeCategory === 'All' ? 'VidaSazón | Healthy Diabetic-Friendly Recipes' : `Easy Diabetic ${activeCategory} Recipes | VidaSazón`}
        description={activeCategory === 'All' ? 'Discover 718 nutritionist-approved recipes designed for people with type 2 diabetes. Flavor without compromise.' : `Explore our delicious, nutritionist-approved diabetic-friendly ${activeCategory.toLowerCase()} recipes. Fast, easy, and healthy.`}
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
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<><HeadManager title="Privacy Policy | VidaSazón" description="VidaSazón privacy policy. Learn how we collect, use, and protect your personal information. We are committed to data security and transparency." canonical="https://vidasazon.com/privacy" /><SiteHeader /><PrivacyPolicy /><SiteFooter /></>} />
        <Route path="/terms" element={<><HeadManager title="Terms &amp; Conditions | VidaSazón" description="VidaSazón terms and conditions. Read about our medical disclaimer, recipe data attribution, user conduct, and limitation of liability." canonical="https://vidasazon.com/terms" /><SiteHeader /><TermsAndConditions /><SiteFooter /></>} />
        <Route path="/about" element={<><HeadManager title="About VidaSazón | Academic Recipe Platform" description="Learn about VidaSazón's 718 dietitian-approved diabetic-friendly recipes sourced from Durban University of Technology. Meet our team and mission." canonical="https://vidasazon.com/about" /><SiteHeader /><AboutPage /><SiteFooter /></>} />
      </Routes>
    </RecipesContext.Provider>
  );
}

export default App;
