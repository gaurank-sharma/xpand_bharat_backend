const router = require('express').Router();
const Insight = require('../models/Insight');
const { protect } = require('../middleware/auth');
const { cloudinary, memoryUpload, uploadToCloudinary } = require('../config/cloudinary');

const slugify = (text) =>
  text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// GET /api/insights — public, published only
router.get('/', async (req, res) => {
  const { tag, limit = 20, page = 1 } = req.query;
  const filter = { status: 'published' };
  if (tag) filter.tag = new RegExp(tag, 'i');
  try {
    const [data, total] = await Promise.all([
      Insight.find(filter)
        .sort({ order: -1, createdAt: -1 })
        .skip((page - 1) * +limit)
        .limit(+limit)
        .select('-imagePublicId -content'),
      Insight.countDocuments(filter),
    ]);
    res.json({ success: true, data, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/insights/all — admin: all insights
router.get('/all', protect, async (_req, res) => {
  try {
    const data = await Insight.find().sort({ createdAt: -1 }).select('-imagePublicId');
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/insights/:slug — public single
router.get('/:slug', async (req, res) => {
  try {
    const insight = await Insight.findOne({ slug: req.params.slug, status: 'published' }).select('-imagePublicId');
    if (!insight) return res.status(404).json({ success: false, message: 'Insight not found' });
    res.json({ success: true, data: insight });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/insights — admin: create
router.post('/', protect, memoryUpload.single('image'), async (req, res) => {
  const { tag, title, excerpt, content, readTime, displayDate, status, order } = req.body;
  if (!tag || !title || !excerpt) return res.status(400).json({ success: false, message: 'tag, title and excerpt are required' });
  try {
    let slug = slugify(title);
    const exists = await Insight.findOne({ slug });
    if (exists) slug = `${slug}-${Date.now()}`;

    let img = '';
    let imagePublicId = '';
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'insights');
      img = result.secure_url;
      imagePublicId = result.public_id;
    }

    const insight = await Insight.create({
      tag, title, slug, excerpt,
      content:       content || '',
      readTime:      readTime || '5 min read',
      displayDate:   displayDate || new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' }),
      img,
      imagePublicId,
      status:        status || 'draft',
      order:         +order || 0,
    });
    res.status(201).json({ success: true, data: insight });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/insights/:id — admin: update
router.put('/:id', protect, memoryUpload.single('image'), async (req, res) => {
  try {
    const insight = await Insight.findById(req.params.id);
    if (!insight) return res.status(404).json({ success: false, message: 'Insight not found' });

    const fields = ['tag', 'title', 'excerpt', 'content', 'readTime', 'displayDate', 'status', 'order'];
    fields.forEach((f) => { if (req.body[f] !== undefined) insight[f] = req.body[f]; });

    if (req.file) {
      if (insight.imagePublicId) await cloudinary.uploader.destroy(insight.imagePublicId);
      const result = await uploadToCloudinary(req.file.buffer, 'insights');
      insight.img = result.secure_url;
      insight.imagePublicId = result.public_id;
    }

    await insight.save();
    res.json({ success: true, data: insight });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/insights/:id — admin
router.delete('/:id', protect, async (req, res) => {
  try {
    const insight = await Insight.findByIdAndDelete(req.params.id);
    if (!insight) return res.status(404).json({ success: false, message: 'Insight not found' });
    if (insight.imagePublicId) await cloudinary.uploader.destroy(insight.imagePublicId);
    res.json({ success: true, message: 'Insight deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
