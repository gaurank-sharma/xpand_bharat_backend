// Uploads the frontend's local images to Cloudinary and writes scripts/cloudinary-map.json
// Map keys are the frontend public paths (e.g. "/img/photo-xxx.jpg", "/investor.png").
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const FE_PUBLIC = '/Users/Gaurank/Downloads/Xpand_Bharat/public';
const FOLDER = `${process.env.CLOUDINARY_FOLDER}/site`;

const files = [];
// /img/*.jpg|png
const imgDir = path.join(FE_PUBLIC, 'img');
fs.readdirSync(imgDir)
  .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
  .forEach((f) => files.push({ abs: path.join(imgDir, f), key: `/img/${f}`, id: f.replace(/\.[^.]+$/, '') }));
// user-provided pngs in public root
[['about us.png', '/about%20us.png', 'about-us'], ['investor.png', '/investor.png', 'investor']].forEach(([file, key, id]) => {
  const abs = path.join(FE_PUBLIC, file);
  if (fs.existsSync(abs)) files.push({ abs, key, id });
});

(async () => {
  const map = {};
  for (const f of files) {
    const res = await cloudinary.uploader.upload(f.abs, {
      folder: FOLDER,
      public_id: f.id,
      overwrite: true,
      resource_type: 'image',
    });
    map[f.key] = res.secure_url;
    console.log(`✓ ${f.key}  ->  ${res.secure_url}`);
  }
  fs.writeFileSync(path.join(__dirname, 'cloudinary-map.json'), JSON.stringify(map, null, 2));
  console.log(`\nWrote cloudinary-map.json with ${Object.keys(map).length} entries.`);
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
