// One-off: refresh footer copy on the existing SiteSettings doc (seed only
// creates-if-missing, so stored values need a direct update).
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
const mongoose = require('mongoose');
const SiteSettings = require('../models/SiteSettings');

const FOOTER_DESCRIPTION = "XPAND Bharat, a venture by XPANDVERSE PVT. LTD., is India's leading franchise expansion and investment consulting company — backed by 25+ years of collective industry experience in franchise growth, investor alignment, and business expansion strategy.";
const COPYRIGHT_TEXT = 'XPANDVERSE PVT. LTD. All rights reserved.';

(async () => {
  await mongoose.connect(process.env.MONGODB_URI, { family: 4 });
  const res = await SiteSettings.updateOne(
    {},
    { $set: { footerDescription: FOOTER_DESCRIPTION, copyrightText: COPYRIGHT_TEXT } }
  );
  console.log(`✓ SiteSettings footer copy updated (matched ${res.matchedCount}, modified ${res.modifiedCount}).`);
  await mongoose.disconnect();
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
