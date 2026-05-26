const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  companyName:    { type: String, default: 'Xpand Bharat' },
  tagline:        { type: String, default: 'Less noise. More execution.' },
  email:          { type: String, default: 'info@xpandbharat.com' },
  phone:          { type: String, default: '' },
  whatsapp:       { type: String, default: '' },
  address:        { type: String, default: 'Gurgaon, Haryana, India' },
  logoUrl:        { type: String, default: '' },
  logoPublicId:   { type: String, default: '' },
  footerTagline:  { type: String, default: '"Less noise. More execution. Brands + investors aligned."' },
  footerSubline:  { type: String, default: 'No drama, only delivery.' },
  copyrightText:  { type: String, default: '© 2025 XPANDBHARAT. All rights reserved.' },
  socialLinks: {
    linkedin:  { type: String, default: '' },
    instagram: { type: String, default: '' },
    twitter:   { type: String, default: '' },
  },
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
