const mongoose = require('mongoose');

const insightSchema = new mongoose.Schema({
  tag:           { type: String, required: true, trim: true },
  title:         { type: String, required: true, trim: true },
  slug:          { type: String, required: true, unique: true, lowercase: true },
  excerpt:       { type: String, required: true, trim: true },
  content:       { type: String, default: '' },
  readTime:      { type: String, default: '5 min read' },
  displayDate:   { type: String },
  img:           { type: String, default: '' },
  imagePublicId: { type: String },
  status:        { type: String, enum: ['draft', 'published'], default: 'draft' },
  order:         { type: Number, default: 0 },
}, { timestamps: true });

insightSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Insight', insightSchema);
