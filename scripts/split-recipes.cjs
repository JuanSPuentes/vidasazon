const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const recipes = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src', 'data_recipes.json'), 'utf8'));

const chunkSize = 50;
const numChunks = Math.ceil(recipes.length / chunkSize);

console.log(`Creating ${numChunks} recipe chunks from ${recipes.length} recipes...`);

for (let i = 0; i < recipes.length; i += chunkSize) {
  const chunk = recipes.slice(i, i + chunkSize);
  const page = Math.floor(i / chunkSize) + 1;
  const fp = path.join(__dirname, '..', 'public', `recipes-${page}.json`);
  fs.writeFileSync(fp, JSON.stringify(chunk));
  const compressed = zlib.gzipSync(JSON.stringify(chunk));
  fs.writeFileSync(fp + '.gz', compressed);
  console.log(`Created recipes-${page}.json (${chunk.length} recipes, ${(compressed.length/1024).toFixed(1)}KB gzipped)`);
}

fs.writeFileSync(
  path.join(__dirname, '..', 'public', 'recipes-index.json'),
  JSON.stringify({
    total: recipes.length,
    pageSize: chunkSize,
    totalPages: numChunks,
    pages: Array.from({ length: numChunks }, (_, i) => i + 1)
  }, null, 2)
);

const indexGz = zlib.gzipSync(JSON.stringify({
  total: recipes.length,
  pageSize: chunkSize,
  totalPages: numChunks,
  pages: Array.from({ length: numChunks }, (_, i) => i + 1)
}));
fs.writeFileSync(path.join(__dirname, '..', 'public', 'recipes-index.json.gz'), indexGz);

console.log('Done!');