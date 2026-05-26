const mongoose = require('mongoose');

const PAGES = ['home','for-brands','for-investors','growth-opportunities','our-approach','industries','about','insights','contact'];

const pageHeroSchema = new mongoose.Schema({
  page:            { type: String, enum: PAGES, required: true, unique: true },
  label:           { type: String, default: '' },
  title:           { type: String, default: '' },
  titleHighlight:  { type: String, default: '' },
  subtitle:        { type: String, default: '' },
  backgroundImage: { type: String, default: '' },
  imagePublicId:   { type: String, default: '' },
  ctaText:         { type: String, default: '' },
  ctaLink:         { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('PageHero', pageHeroSchema);
