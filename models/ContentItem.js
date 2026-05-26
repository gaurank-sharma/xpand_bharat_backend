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
  isActive:     { type: Boolean, default: true },
}, { timestamps: true });

contentItemSchema.index({ page: 1, section: 1, order: 1 });

module.exports = mongoose.model('ContentItem', contentItemSchema);
