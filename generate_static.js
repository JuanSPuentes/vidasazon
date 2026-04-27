import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://vidasazon.com';
const DIST_DIR = path.join(__dirname, 'dist');
const INDEX_PATH = path.join(DIST_DIR, 'index.html');

console.log('🚀 Starting Pre-rendering for SEO...');

if (!fs.existsSync(INDEX_PATH)) {
    console.error('❌ dist/index.html not found. Run "npm run build" first.');
    process.exit(1);
}

const baseHtml = fs.readFileSync(INDEX_PATH, 'utf8');

// Load Recipes
const recipesPath = path.join(__dirname, 'src', 'data_recipes.json');
let recipes = [];
try {
    const rawData = fs.readFileSync(recipesPath, 'utf8');
    recipes = JSON.parse(rawData);
} catch (e) {
    console.error('❌ Error reading data_recipes.json:', e);
    process.exit(1);
}

function slugify(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function prerenderPage(subPath, title, description, canonical, image) {
    const targetDir = path.join(DIST_DIR, subPath);
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    let html = baseHtml;

    // Replace Title
    html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
    
    // Replace Meta Description
    html = html.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${description.replace(/"/g, '&quot;')}" />`);

    // Replace OG/Twitter tags
    html = html.replace(/<meta property="og:title" content=".*?" \/>/g, `<meta property="og:title" content="${title.replace(/"/g, '&quot;')}" />`);
    html = html.replace(/<meta property="og:description" content=".*?" \/>/g, `<meta property="og:description" content="${description.replace(/"/g, '&quot;')}" />`);
    html = html.replace(/<meta property="og:url" content=".*?" \/>/g, `<meta property="og:url" content="${canonical}" />`);
    if (image) {
        html = html.replace(/<meta property="og:image" content=".*?" \/>/g, `<meta property="og:image" content="${image}" />`);
    }

    // Inject Canonical if it was removed or placeholder
    if (html.includes('</head>')) {
        const canonicalTag = `<link rel="canonical" href="${canonical}" />`;
        html = html.replace('</head>', `  ${canonicalTag}\n  </head>`);
    }

    fs.writeFileSync(path.join(targetDir, 'index.html'), html);
}

// 1. Prerender Recipes
recipes.forEach(recipe => {
    const title = `${recipe.title} | ${recipe.category} | VidaSazón`;
    const description = `${recipe.title} - Diabetic-friendly ${recipe.category.toLowerCase()} recipe. ${recipe.ingredients?.length || 0} ingredients. Low GI meal for type 2 diabetes management.`;
    const canonical = `${DOMAIN}/recipe/${recipe.slug}`;
    const image = recipe.image ? (recipe.image.startsWith('http') ? recipe.image : `${DOMAIN}${recipe.image}`) : `${DOMAIN}/og-image.webp`;

    prerenderPage(`recipe/${recipe.slug}`, title, description, canonical, image);
});

// 2. Prerender Categories
const CATEGORIES = [
    'Main Dishes', 'Desserts', 'Beverages', 'Soups & Stews', 'Salads', 'Breakfast', 'Sides', 'Snacks & Breads', 'Sauces & Dressings'
];

CATEGORIES.forEach(cat => {
    const slug = slugify(cat);
    const title = `Easy Diabetic ${cat} Recipes | VidaSazón`;
    const description = `Explore our delicious, nutritionist-approved diabetic-friendly ${cat.toLowerCase()} recipes. Fast, easy, and healthy.`;
    const canonical = `${DOMAIN}/category/${slug}`;

    prerenderPage(`category/${slug}`, title, description, canonical);
});

// 3. Prerender Static Pages
const staticPages = [
    { path: 'about', title: 'About VidaSazón', desc: 'VidaSazón is a platform dedicated to preserving flavor for people managing type 2 diabetes.' },
    { path: 'contact', title: 'Contact Us | VidaSazón', desc: 'Get in touch with the VidaSazón team.' },
    { path: 'privacy', title: 'Privacy Policy | VidaSazón', desc: 'Privacy policy for VidaSazón.' },
    { path: 'terms', title: 'Terms & Conditions | VidaSazón', desc: 'Terms and conditions for using VidaSazón.' }
];

staticPages.forEach(p => {
    prerenderPage(p.path, p.title, p.desc, `${DOMAIN}/${p.path}`);
});

console.log(`✅ Pre-rendered ${recipes.length} recipes and ${CATEGORIES.length} categories.`);
