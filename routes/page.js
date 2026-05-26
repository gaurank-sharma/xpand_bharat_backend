const router = require('express').Router();
const PageHero = require('../models/PageHero');
const ContentItem = require('../models/ContentItem');
const { protect } = require('../middleware/auth');
const { cloudinary, memoryUpload, uploadToCloudinary } = require('../config/cloudinary');

// GET /api/page/:page — public: returns hero + all active items grouped by section
router.get('/:page', async (req, res) => {
  try {
    const [hero, items] = await Promise.all([
      PageHero.findOne({ page: req.params.page }),
      ContentItem.find({ page: req.params.page, isActive: true }).sort({ section: 1, order: 1 }),
    ]);
    const sections = items.reduce((acc, item) => {
      if (!acc[item.section]) acc[item.section] = [];
      acc[item.section].push(item);
      return acc;
    }, {});
    res.json({ success: true, data: { hero, sections } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// PUT /api/page/:page/hero — admin: update hero (can include image upload)
router.put('/:page/hero', protect, memoryUpload.single('image'), async (req, res) => {
  try {
    let hero = await PageHero.findOne({ page: req.params.page });
    if (!hero) hero = new PageHero({ page: req.params.page });

    const fields = ['label','title','titleHighlight','subtitle','ctaText','ctaLink'];
    fields.forEach(f => { if (req.body[f] !== undefined) hero[f] = req.body[f]; });

    if (req.file) {
      if (hero.imagePublicId) await cloudinary.uploader.destroy(hero.imagePublicId);
      const result = await uploadToCloudinary(req.file.buffer, 'heroes');
      hero.backgroundImage = result.secure_url;
      hero.imagePublicId = result.public_id;
    } else if (req.body.backgroundImage) {
      hero.backgroundImage = req.body.backgroundImage;
    }

    await hero.save();
    res.json({ success: true, data: hero });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
