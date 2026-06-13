// Rewrites seed.js to use Cloudinary URLs:
//  - content images: any images.unsplash.com/<id> -> mapped Cloudinary URL
//  - hero backgroundImage: set per page from HERO_KEY
const fs = require('fs');
const path = require('path');
const map = require('./cloudinary-map.json');
const seedPath = path.join(__dirname, 'seed.js');
let src = fs.readFileSync(seedPath, 'utf8');

// page -> the local image key (as stored in the cloudinary map)
const HERO_KEY = {
  home: '',
  'for-brands': '/img/photo-1441986300917-64674bd600d8.jpg',
  'for-investors': '/investor.png',
  'growth-opportunities': '/img/photo-1449157291145-7efd050a4d0e.jpg',
  'our-approach': '/img/photo-1553877522-43269d4ea984.jpg',
  industries: '/img/photo-1480714378408-67cf0d13bc1b.jpg',
  about: '/about%20us.png',
  insights: '/img/photo-1532012197267-da84d127e765.jpg',
  contact: '/img/photo-1431576901776-e539bd916ba2.jpg',
};

// 1) content images: unsplash <id> -> cloudinary
let contentReplaced = 0;
for (const [key, url] of Object.entries(map)) {
  const m = key.match(/photo-[0-9a-f-]+/);
  if (!m) continue;
  const re = new RegExp(`https://images\\.unsplash\\.com/${m[0]}\\?[^'"]*`, 'g');
  src = src.replace(re, () => { contentReplaced++; return url; });
}

// 2) hero backgroundImage per page (only within the HEROES section)
const lines = src.split('\n');
const contentMarker = lines.findIndex((l) => l.includes('CONTENT ITEMS'));
const limit = contentMarker === -1 ? lines.length : contentMarker;
let curPage = null;
let heroSet = 0;
for (let i = 0; i < limit; i++) {
  const pm = lines[i].match(/page:\s*'([^']+)'/);
  if (pm) curPage = pm[1];
  if (curPage && Object.prototype.hasOwnProperty.call(HERO_KEY, curPage) && /backgroundImage:\s*'[^']*'/.test(lines[i])) {
    const localKey = HERO_KEY[curPage];
    const url = localKey ? (map[localKey] || '') : '';
    lines[i] = lines[i].replace(/backgroundImage:\s*'[^']*'/, `backgroundImage: '${url}'`);
    heroSet++;
    curPage = null; // one hero image per page block
  }
}
src = lines.join('\n');

fs.writeFileSync(seedPath, src);
console.log(`content image URLs replaced: ${contentReplaced}`);
console.log(`hero backgroundImages set: ${heroSet}`);

// report any unsplash links still left
const leftover = (src.match(/images\.unsplash\.com\/photo-[0-9a-f-]+/g) || []);
if (leftover.length) console.log(`\n⚠ ${leftover.length} unsplash URLs still in seed (not in map):`, [...new Set(leftover)]);
else console.log('No unsplash URLs left in seed.');
