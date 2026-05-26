const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  email:       { type: String, required: true, lowercase: true, trim: true },
  company:     { type: String, trim: true },
  mobile:      { type: String, trim: true },
  requirement: { type: String, trim: true },
  markets:     { type: String, trim: true },
  message:     { type: String, trim: true },
  status:      { type: String, enum: ['new', 'read', 'replied', 'resolved', 'spam'], default: 'new' },
  ip:          { type: String },
}, { timestamps: true });

contactSchema.index({ createdAt: -1 });
contactSchema.index({ status: 1 });

module.exports = mongoose.model('Contact', contactSchema);
