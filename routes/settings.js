const router = require('express').Router();
const SiteSettings = require('../models/SiteSettings');
const { protect } = require('../middleware/auth');
const { cloudinary, memoryUpload, uploadToCloudinary } = require('../config/cloudinary');

const getSettings = async () => {
  let s = await SiteSettings.findOne();
  if (!s) s = await SiteSettings.create({});
  return s;
};

// GET /api/settings — public
router.get('/', async (_req, res) => {
  try {
    res.json({ success: true, data: await getSettings() });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// PUT /api/settings — admin (JSON body)
router.put('/', protect, async (req, res) => {
  try {
    const s = await getSettings();
    const fields = ['companyName','tagline','email','phone','whatsapp','address','footerDescription','footerHeading','footerTagline','footerSubline','copyrightText'];
    fields.forEach(f => { if (req.body[f] !== undefined) s[f] = req.body[f]; });
    if (req.body.socialLinks) {
      s.socialLinks.linkedin  = req.body.socialLinks.linkedin  ?? s.socialLinks.linkedin;
      s.socialLinks.instagram = req.body.socialLinks.instagram ?? s.socialLinks.instagram;
      s.socialLinks.facebook  = req.body.socialLinks.facebook  ?? s.socialLinks.facebook;
      s.socialLinks.twitter   = req.body.socialLinks.twitter   ?? s.socialLinks.twitter;
    }
    await s.save();
    res.json({ success: true, data: s });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// POST /api/settings/logo — admin
router.post('/logo', protect, memoryUpload.single('logo'), async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  try {
    const s = await getSettings();
    if (s.logoPublicId) await cloudinary.uploader.destroy(s.logoPublicId);
    const result = await uploadToCloudinary(req.file.buffer, 'logo');
    s.logoUrl = result.secure_url;
    s.logoPublicId = result.public_id;
    await s.save();
    res.json({ success: true, data: s });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
