const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://vidasazon.com';
const INPUT_FILE = path.join(__dirname, '../public/recipes-meta.json');
const OUTPUT_FILE = path.join(__dirname, '../public/pinterest-feed.xml');

try {
  const rawData = fs.readFileSync(INPUT_FILE, 'utf8');
  const categories = JSON.parse(rawData);
  
  let itemsXml = '';
  let count = 0;
  Object.keys(categories).forEach(categoryName => {
    const categoryNameClean = categoryName.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    categories[categoryName].forEach(recipe => {
      const url = `${BASE_URL}/recipe/${recipe.slug}`;
      const imageUrl = `${BASE_URL}${recipe.image}`;
      const description = `${recipe.title} - Receta saludable para diabéticos. Categoría: ${categoryName}. Bajo índice glucémico. Descubre más de 700 recetas en VidaSazón. #diabeticfriendly #vidasazon #healthyrecipes`;
      
      const cleanTitle = recipe.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const cleanDesc = description.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const cleanUrl = url.replace(/&/g, '&amp;');
      const cleanImageUrl = imageUrl.replace(/&/g, '&amp;');

      itemsXml += `
    <item>
      <title>${cleanTitle}</title>
      <link>${cleanUrl}</link>
      <description>${cleanDesc}</description>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <guid isPermaLink="true">${cleanUrl}</guid>
      <media:content url="${cleanImageUrl}" medium="image" />
      <category>${categoryNameClean}</category>
    </item>`;
      count++;
    });
  });

  const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>VidaSazón - Recetas Saludables para Diabéticos</title>
    <link>${BASE_URL}</link>
    <description>Más de 700 recetas bajas en índice glucémico para una vida más sabrosa y saludable.</description>
    <language>es</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${itemsXml}
  </channel>
</rss>`;

  fs.writeFileSync(OUTPUT_FILE, rssXml);
  console.log(`✅ Success! Generated Pinterest RSS feed with ${count} recipes at: ${OUTPUT_FILE}`);
  console.log(`🔗 Access it at: ${BASE_URL}/pinterest-feed.xml`);

} catch (error) {
  console.error('❌ Error generating Pinterest feed:', error);
}
