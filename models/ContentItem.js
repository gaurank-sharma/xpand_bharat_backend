const mongoose = require('mongoose');

const contentItemSchema = new mongoose.Schema({
  page:         { type: String, required: true },
  section:      { type: String, required: true },
  order:        { type: Number, default: 0 },
  badge:        { type: String, default: '' },
  tag:          { type: String, default: '' },
  title:        { type: String, default: '' },
  subtitle:     { type: String, default: '' },
  description:  { type: String, default: '' },
  metrics:      [String],
  imageUrl:     { type: String, default: '' },
  imagePublicId:{ type: String, default: '' },
  link:         { type: String, default: '' },
  extra:        { type: String, default: '' },
  // Rich content fields (used by multi-part sections like the expansion framework,
  // why-us bullet blocks, and the industries flip cards)
  intro:        { type: String, default: '' },
  lead:         { type: String, default: '' },
  closing:      { type: String, default: '' },
  quote:        { type: String, default: '' },
  items:        [String],
  paras:        [String],
  frontDesc:    { type: String, default: '' },
  backStat:     { type: String, default: '' },
  backDesc:     { type: String, default: '' },
  isActive:     { type: Boolean, default: true },
}, { timestamps: true });

contentItemSchema.index({ page: 1, section: 1, order: 1 });

module.exports = mongoose.model('ContentItem', contentItemSchema);
