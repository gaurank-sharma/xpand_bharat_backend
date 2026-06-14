const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Admin-panel sections that access can be granted to
const SECTIONS = ['dashboard', 'leads', 'contacts', 'insights', 'pages', 'settings', 'members'];

const adminSchema = new mongoose.Schema({
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  name:     { type: String, default: 'Admin' },
  role:     { type: String, enum: ['superadmin', 'member'], default: 'member' },
  // sections this admin may access (superadmins implicitly have all)
  permissions: { type: [String], default: [] },
}, { timestamps: true });

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

adminSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

// effective permissions (superadmin = all sections)
adminSchema.methods.allowedSections = function () {
  return this.role === 'superadmin' ? SECTIONS : (this.permissions || []);
};

const Admin = mongoose.model('Admin', adminSchema);
Admin.SECTIONS = SECTIONS;
module.exports = Admin;
