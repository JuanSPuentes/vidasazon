import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://vidasazon.com';
const CATEGORIES = [
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

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function escapeXml(unsafe) {
    if (!unsafe) return '';
    return unsafe.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
}

const currentDate = new Date().toISOString().split('T')[0];
let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
xml += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

// 1. Static Routes
const staticRoutes = [
    { loc: `${DOMAIN}/`, changefreq: 'daily', priority: '1.0' },
    { loc: `${DOMAIN}/about`, changefreq: 'monthly', priority: '0.7' },
    { loc: `${DOMAIN}/contact`, changefreq: 'monthly', priority: '0.6' },
    { loc: `${DOMAIN}/privacy`, changefreq: 'yearly', priority: '0.3' },
    { loc: `${DOMAIN}/terms`, changefreq: 'yearly', priority: '0.3' }
];

for (const route of staticRoutes) {
    xml += `  <url>\n`;
    xml += `    <loc>${route.loc}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;
    xml += `  </url>\n`;
}

// 2. Category Routes
for (const cat of CATEGORIES) {
    xml += `  <url>\n`;
    xml += `    <loc>${DOMAIN}/category/${slugify(cat)}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
}

// 3. Recipe Routes with Image SEO
try {
    const rawData = fs.readFileSync(path.join(__dirname, 'src', 'data_recipes.json'), 'utf8');
    const recipes = JSON.parse(rawData);

    for (const recipe of recipes) {
        xml += `  <url>\n`;
        xml += `    <loc>${DOMAIN}/recipe/${recipe.slug}</loc>\n`;
        xml += `    <lastmod>${currentDate}</lastmod>\n`;
        xml += `    <changefreq>monthly</changefreq>\n`;
        xml += `    <priority>0.7</priority>\n`;
        
        // Critical for Google / Pinterest Image Indexing
        if (recipe.image) {
            xml += `    <image:image>\n`;
            // Ensures Absolute URL for images
            const imageUrl = recipe.image.startsWith('http') ? recipe.image : `${DOMAIN}${recipe.image}`;
            xml += `      <image:loc>${escapeXml(imageUrl)}</image:loc>\n`;
            xml += `      <image:title>${escapeXml(recipe.title)}</image:title>\n`;
            xml += `      <image:caption>Diabetic-friendly ${escapeXml(recipe.category.toLowerCase())} recipe for type 2 diabetes management</image:caption>\n`;
            xml += `    </image:image>\n`;
        }
        xml += `  </url>\n`;
    }
    
    console.log(`✅ Loaded ${recipes.length} recipes for sitemap generation.`);
} catch(e) {
    console.error('❌ Error reading data_recipes.json:', e);
}

xml += `</urlset>`;

// Write to public folder
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)){
    fs.mkdirSync(publicDir);
}

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml);

console.log('✅ sitemap.xml generated successfully in the public/ folder.');
