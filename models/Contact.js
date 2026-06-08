const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  email:       { type: String, required: true, lowercase: true, trim: true },
  company:     { type: String, trim: true },
  mobile:      { type: String, trim: true },
  requirement: { type: String, trim: true },
  markets:     { type: String, trim: true },
  message:     { type: String, trim: true },
  // ── Multi-step lead form fields ──
  role:           { type: String, trim: true },   // 'Business Owner' | 'Investor'
  primaryGoal:    { type: String, trim: true },   // screen-1 sub-selection
  sector:         { type: String, trim: true },   // screen-2
  geography:      { type: String, trim: true },
  budget:         { type: String, trim: true },
  timeline:       { type: String, trim: true },
  consentReport:  { type: Boolean, default: false },
  consentContact: { type: Boolean, default: false },
  source:         { type: String, trim: true },   // which page the form came from
  status:      { type: String, enum: ['new', 'read', 'replied', 'resolved', 'spam'], default: 'new' },
  ip:          { type: String },
}, { timestamps: true });

contactSchema.index({ createdAt: -1 });
contactSchema.index({ status: 1 });

module.exports = mongoose.model('Contact', contactSchema);
