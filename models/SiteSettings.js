const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  companyName:    { type: String, default: 'XPAND Bharat' },
  tagline:        { type: String, default: 'Less noise. More execution.' },
  email:          { type: String, default: 'contact@xpandbharat.com' },
  phone:          { type: String, default: '+91 77172 72838' },
  whatsapp:       { type: String, default: '+91 77172 72838' },
  address:        { type: String, default: 'Gurugram, Haryana, India' },
  logoUrl:        { type: String, default: '' },
  logoPublicId:   { type: String, default: '' },
  footerDescription: { type: String, default: "XPAND Bharat is India's leading franchise expansion and investment consulting company, backed by 25+ years of collective industry experience in franchise growth, investor alignment, and business expansion strategy." },
  footerHeading:  { type: String, default: 'Ready to move' },
  footerTagline:  { type: String, default: 'Less noise. More execution.' },
  footerSubline:  { type: String, default: '' },
  copyrightText:  { type: String, default: 'XPANDBHARAT. All rights reserved.' },
  socialLinks: {
    linkedin:  { type: String, default: 'https://www.linkedin.com/company/xpandbharat/' },
    instagram: { type: String, default: 'https://www.instagram.com/xpandbharat' },
    facebook:  { type: String, default: 'https://www.facebook.com/share/1HFEiRkeXX/?mibextid=wwXIfr' },
    twitter:   { type: String, default: '' },
  },
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
