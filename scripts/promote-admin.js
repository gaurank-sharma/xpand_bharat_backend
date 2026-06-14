// One-off: make the primary admin a superadmin with full section access.
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

(async () => {
  await mongoose.connect(process.env.MONGODB_URI, { family: 4 });
  const res = await Admin.updateOne(
    { email: process.env.ADMIN_EMAIL },
    { $set: { role: 'superadmin', permissions: Admin.SECTIONS } }
  );
  console.log(`✓ Promoted ${process.env.ADMIN_EMAIL} to superadmin (matched ${res.matchedCount}, modified ${res.modifiedCount}).`);
  await mongoose.disconnect();
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
