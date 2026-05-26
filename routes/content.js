const router = require('express').Router();
const ContentItem = require('../models/ContentItem');
const { protect } = require('../middleware/auth');
const { cloudinary, memoryUpload, uploadToCloudinary } = require('../config/cloudinary');

// GET /api/content?page=&section= — admin
router.get('/', protect, async (req, res) => {
  const filter = {};
  if (req.query.page)    filter.page = req.query.page;
  if (req.query.section) filter.section = req.query.section;
  try {
    const data = await ContentItem.find(filter).sort({ page: 1, section: 1, order: 1 });
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// POST /api/content — admin
router.post('/', protect, memoryUpload.single('image'), async (req, res) => {
  try {
    const fields = ['page','section','order','badge','tag','title','subtitle','description','link','extra','isActive'];
    const body = {};
    fields.forEach(f => { if (req.body[f] !== undefined) body[f] = req.body[f]; });
    if (req.body.metrics) body.metrics = JSON.parse(req.body.metrics);
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'content');
      body.imageUrl = result.secure_url;
      body.imagePublicId = result.public_id;
    }
    const item = await ContentItem.create(body);
    res.status(201).json({ success: true, data: item });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// PUT /api/content/:id — admin
router.put('/:id', protect, memoryUpload.single('image'), async (req, res) => {
  try {
    const item = await ContentItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    const fields = ['page','section','order','badge','tag','title','subtitle','description','link','extra','isActive'];
    fields.forEach(f => { if (req.body[f] !== undefined) item[f] = req.body[f]; });
    if (req.body.metrics) item.metrics = JSON.parse(req.body.metrics);
    if (req.file) {
      if (item.imagePublicId) await cloudinary.uploader.destroy(item.imagePublicId);
      const result = await uploadToCloudinary(req.file.buffer, 'content');
      item.imageUrl = result.secure_url;
      item.imagePublicId = result.public_id;
    }
    await item.save();
    res.json({ success: true, data: item });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// DELETE /api/content/:id — admin
router.delete('/:id', protect, async (req, res) => {
  try {
    const item = await ContentItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    if (item.imagePublicId) await cloudinary.uploader.destroy(item.imagePublicId);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// PUT /api/content/reorder — admin: bulk order update
router.put('/reorder/bulk', protect, async (req, res) => {
  try {
    const { items } = req.body; // [{ id, order }]
    await Promise.all(items.map(({ id, order }) => ContentItem.findByIdAndUpdate(id, { order })));
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
