const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://vidasazon.com';
const INPUT_FILE = path.join(__dirname, '../public/recipes-meta.json');

const categoryToBoard = {
  'Main Dishes': 'VidaSazón - Main Dishes',
  'Desserts': 'Vidasazón desserts',
  'Breakfast': 'Vidasazón breakfast',
  'Soups & Stews': 'Vidasazón soups & stews',
  'Snacks & Breads': 'Vidasazón snacks & breads',
  'Salads': 'Vidasazón salads',
  'Sides': 'Vidasazón sides',
  'Sauces & Dressings': 'Vidasazón sauces & dressings',
  'Beverages': 'Vidasazón beverages'
};

try {
  const rawData = fs.readFileSync(INPUT_FILE, 'utf8');
  const categories = JSON.parse(rawData);

  const allRecipes = [];
  Object.keys(categories).forEach(cat => {
    categories[cat].forEach(r => allRecipes.push({ ...r, category: cat }));
  });

  const CHUNK_SIZE = 190;
  const now = new Date();
  const formattedDate = now.toISOString().replace('T', ' ').substring(0, 19);

  for (let i = 0; i < allRecipes.length; i += CHUNK_SIZE) {
    const chunk = allRecipes.slice(i, i + CHUNK_SIZE);
    const partNum = Math.floor(i / CHUNK_SIZE) + 1;
    const outputFilename = path.join(__dirname, `../public/pinterest-bulk-part-${partNum}.csv`);

    // Headers following the user's preference
    const headers = ['Title', 'Description', 'Media URL', 'Link', 'Pinterest board', 'Pin ID'];
    let csvContent = headers.join(',') + '\r\n';

    chunk.forEach(recipe => {
      const url = `${BASE_URL}/recipe/${recipe.slug}`;
      const imageUrl = `${BASE_URL}${recipe.image}`;
      const description = `${recipe.title} - Healthy recipe for diabetics. Category: ${recipe.category}. Low Glycemic Index. #diabeticfriendly #healthyrecipes`;
      const boardName = categoryToBoard[recipe.category] || 'VidaSazón - Main Dishes';

      const escapeCsv = (str) => `"${str.toString().replace(/"/g, '""')}"`;
      
      csvContent += [
        escapeCsv(recipe.title),
        escapeCsv(description),
        escapeCsv(imageUrl),
        escapeCsv(url),
        escapeCsv(boardName),
        '""' // Pin ID (empty for new pins)
      ].join(',') + '\r\n';
    });

    fs.writeFileSync(outputFilename, csvContent, 'utf8');
    console.log(`✅ Generated Part ${partNum} (${chunk.length} recipes) at: ${outputFilename}`);
  }

} catch (error) {
  console.error('❌ Error generating Pinterest CSV:', error);
}
