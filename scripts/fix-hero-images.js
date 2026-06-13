// One-off: blank PageHero.backgroundImage so the frontend's tuned hero images
// become the single source of truth. Does NOT touch page content or anything else.
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
const mongoose = require('mongoose');
const PageHero = require('../models/PageHero');

(async () => {
  await mongoose.connect(process.env.MONGODB_URI, { family: 4 });
  const res = await PageHero.updateMany({}, { $set: { backgroundImage: '' } });
  console.log(`✓ Cleared backgroundImage on ${res.modifiedCount} heroes (matched ${res.matchedCount}).`);
  await mongoose.disconnect();
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
