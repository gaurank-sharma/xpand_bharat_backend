const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { protect, requireSuperadmin } = require('../middleware/auth');

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });

const publicAdmin = (a) => ({
  id: a._id,
  email: a.email,
  name: a.name,
  role: a.role,
  permissions: a.role === 'superadmin' ? Admin.SECTIONS : (a.permissions || []),
  createdAt: a.createdAt,
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' });
  try {
    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    res.json({ success: true, token: sign(admin._id), admin: publicAdmin(admin) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', protect, (req, res) => {
  res.json({ success: true, admin: publicAdmin(req.admin) });
});

// ── Member management (superadmin only) ─────────────────────────────────────
router.get('/members', protect, requireSuperadmin, async (_req, res) => {
  try {
    const members = await Admin.find().select('-password').sort({ createdAt: 1 });
    res.json({ success: true, data: members.map(publicAdmin), sections: Admin.SECTIONS });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/members', protect, requireSuperadmin, async (req, res) => {
  const { email, password, name, role, permissions } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password are required' });
  try {
    if (await Admin.findOne({ email: email.toLowerCase().trim() })) {
      return res.status(400).json({ success: false, message: 'An admin with that email already exists' });
    }
    const valid = (permissions || []).filter((p) => Admin.SECTIONS.includes(p));
    const admin = await Admin.create({
      email: email.toLowerCase().trim(),
      password,
      name: name?.trim() || 'Admin',
      role: role === 'superadmin' ? 'superadmin' : 'member',
      permissions: valid,
    });
    res.status(201).json({ success: true, data: publicAdmin(admin) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/members/:id', protect, requireSuperadmin, async (req, res) => {
  const { name, role, permissions, password } = req.body;
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ success: false, message: 'Member not found' });
    const isSelf = String(admin._id) === String(req.admin._id);
    if (name !== undefined) admin.name = name.trim() || admin.name;
    // Don't let a superadmin demote themselves and get locked out
    if (!isSelf && role !== undefined) admin.role = role === 'superadmin' ? 'superadmin' : 'member';
    if (permissions !== undefined) admin.permissions = (permissions || []).filter((p) => Admin.SECTIONS.includes(p));
    if (password) admin.password = password; // re-hashed by pre-save hook
    await admin.save();
    res.json({ success: true, data: publicAdmin(admin) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/members/:id', protect, requireSuperadmin, async (req, res) => {
  try {
    if (String(req.params.id) === String(req.admin._id)) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account' });
    }
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) return res.status(404).json({ success: false, message: 'Member not found' });
    res.json({ success: true, message: 'Member removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
