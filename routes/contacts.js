const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const Contact = require('../models/Contact');
const { protect } = require('../middleware/auth');

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5, message: { success: false, message: 'Too many submissions. Please try again after 15 minutes.' } });

// POST /api/contacts  — public, rate limited
router.post('/', limiter, async (req, res) => {
  const { name, email, company, mobile, requirement, markets, message } = req.body;
  if (!name || !email) return res.status(400).json({ success: false, message: 'Name and email are required' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ success: false, message: 'Invalid email address' });
  try {
    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      company: company?.trim(),
      mobile: mobile?.trim(),
      requirement: requirement?.trim(),
      markets: markets?.trim(),
      message: message?.trim(),
      ip: req.ip,
    });
    res.status(201).json({ success: true, message: 'Message received. We will contact you within 48 hours.', id: contact._id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/contacts — admin only
router.get('/', protect, async (req, res) => {
  const { status, search, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status && status !== 'all') filter.status = status;
  if (search) {
    const r = new RegExp(search, 'i');
    filter.$or = [{ name: r }, { email: r }, { company: r }];
  }
  try {
    const [data, total, stats] = await Promise.all([
      Contact.find(filter).sort({ createdAt: -1 }).skip((page - 1) * +limit).limit(+limit),
      Contact.countDocuments(filter),
      Contact.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    ]);
    const statsMap = stats.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {});
    res.json({ success: true, data, total, stats: statsMap });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/contacts/:id — admin only
router.put('/:id', protect, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
    res.json({ success: true, data: contact });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/contacts/:id — admin only
router.delete('/:id', protect, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Contact deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
