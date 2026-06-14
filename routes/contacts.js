const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const Contact = require('../models/Contact');
const { protect } = require('../middleware/auth');

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5, message: { success: false, message: 'Too many submissions. Please try again after 15 minutes.' } });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function buildNotificationEmail(data) {
  const { name, email, company, mobile, requirement, markets, message, createdAt,
          role, primaryGoal, sector, geography, budget, timeline, consentContact, source } = data;
  const date = new Date(createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });

  const row = (label, value) => value ? `
    <tr>
      <td style="padding:10px 16px;font-size:13px;font-weight:600;color:#5a6278;white-space:nowrap;vertical-align:top;width:160px;">${label}</td>
      <td style="padding:10px 16px;font-size:13px;color:#1a2340;border-left:1px solid #e8eaf0;vertical-align:top;">${value}</td>
    </tr>` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>New Inquiry — XPAND Bharat</title></head>
<body style="margin:0;padding:0;background:#f0f1f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f1f5;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10);border:2px solid #070f23;">

        <!-- Header -->
        <tr>
          <td style="background:#ffffff;padding:20px 40px 14px;text-align:center;border-bottom:4px solid #f07920;">
            <img src="https://res.cloudinary.com/drewg2mlj/image/upload/v1779987565/logo_yfzehb.png" alt="XPAND Bharat" width="180" style="display:block;margin:0 auto 10px;max-width:180px;" />
            <p style="margin:0;font-size:10px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:#9ea5b8;">India's Leading Franchise Expansion &amp; Advisory Platform</p>
          </td>
        </tr>

        <!-- Alert banner -->
        <tr>
          <td style="background:#f07920;padding:14px 40px;text-align:center;">
            <p style="margin:0;font-size:13px;font-weight:700;color:#fff;letter-spacing:0.08em;text-transform:uppercase;">&#9679; New Inquiry Received</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:36px 40px 24px;">
            <p style="margin:0 0 6px;font-size:24px;font-weight:700;color:#070f23;">Hello, XPAND Team</p>
            <p style="margin:0 0 28px;font-size:15px;color:#5a6278;line-height:1.6;">A new inquiry has been submitted via the website contact form. Details are below.</p>

            <!-- Details table -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8eaf0;border-radius:8px;overflow:hidden;">
              <tbody>
                ${row('Full Name', name)}
                ${row('Email Address', `<a href="mailto:${email}" style="color:#f07920;text-decoration:none;">${email}</a>`)}
                ${row('Mobile Number', mobile)}
                ${row('Company / Brand', company)}
                ${row('I am a', role)}
                ${row('Looking For', primaryGoal)}
                ${row('Preferred Sector', sector)}
                ${row('Preferred Geography', geography || markets)}
                ${row('Budget', budget)}
                ${row('Timeline', timeline)}
                ${row('Requirement', requirement)}
                ${row('OK to Call', consentContact ? 'Yes — advisor may contact' : 'No — report only')}
                ${row('Source Page', source)}
                ${row('Submitted At', date)}
              </tbody>
            </table>

            ${message ? `
            <!-- Message -->
            <div style="margin-top:24px;background:#f8f9fc;border-left:3px solid #f07920;border-radius:0 8px 8px 0;padding:18px 20px;">
              <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#f07920;">Message</p>
              <p style="margin:0;font-size:14px;color:#1a2340;line-height:1.7;">${message.replace(/\n/g, '<br>')}</p>
            </div>` : ''}

            <!-- CTA -->
            <div style="margin-top:32px;text-align:center;">
              <a href="mailto:${email}" style="display:inline-block;background:#f07920;color:#fff;font-size:13px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;padding:14px 32px;border-radius:6px;text-decoration:none;">Reply to ${name.split(' ')[0]}</a>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8f9fc;padding:20px 40px;border-top:1px solid #e8eaf0;text-align:center;">
            <p style="margin:0;font-size:12px;color:#9ea5b8;line-height:1.6;">
              XPAND Bharat — Franchise Expansion &amp; Advisory<br>
              Gurugram, Haryana, India &nbsp;|&nbsp;
              <a href="https://xpandbharat.com" style="color:#f07920;text-decoration:none;">xpandbharat.com</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildConfirmationEmail(name) {
  const firstName = name.split(' ')[0];
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>We've Received Your Inquiry — XPAND Bharat</title></head>
<body style="margin:0;padding:0;background:#f0f1f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f1f5;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10);">

        <!-- Header -->
        <tr>
          <td style="background:#ffffff;padding:20px 40px 14px;text-align:center;border-bottom:4px solid #f07920;">
            <img src="https://res.cloudinary.com/drewg2mlj/image/upload/v1779987565/logo_yfzehb.png" alt="XPAND Bharat" width="180" style="display:block;margin:0 auto 10px;max-width:180px;" />
            <p style="margin:0;font-size:10px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:#9ea5b8;">India's Leading Franchise Expansion &amp; Advisory Platform</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:40px 40px 36px;text-align:center;">
            <table cellpadding="0" cellspacing="0" style="margin:0 auto 24px;">
              <tr>
                <td width="56" height="56" align="center" valign="middle" style="width:56px;height:56px;background:#f07920;border-radius:50%;text-align:center;vertical-align:middle;">
                  <span style="font-size:28px;font-weight:700;color:#ffffff;line-height:1;display:block;">&#10003;</span>
                </td>
              </tr>
            </table>
            <p style="margin:0 0 8px;font-size:26px;font-weight:700;color:#070f23;">Thank you, ${firstName}.</p>
            <p style="margin:0 0 28px;font-size:16px;color:#5a6278;line-height:1.7;">Your inquiry has been received.<br>Our team will get in touch with you within <strong style="color:#070f23;">48 hours</strong>.</p>

            <!-- Timeline -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              <tr>
                <td style="padding-bottom:20px;">
                  <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#f07920;text-align:left;">What Happens Next</p>
                </td>
              </tr>

              <!-- Step 1 -->
              <tr>
                <td>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td width="48" align="center" valign="top">
                        <table cellpadding="0" cellspacing="0" align="center">
                          <tr>
                            <td width="40" height="40" align="center" valign="middle" style="width:40px;height:40px;background:#070f23;border-radius:50%;text-align:center;vertical-align:middle;">
                              <span style="font-size:12px;font-weight:800;color:#f07920;font-family:Arial,sans-serif;display:block;line-height:40px;">01</span>
                            </td>
                          </tr>
                        </table>
                      </td>
                      <td valign="middle" style="padding:0 0 0 14px;">
                        <p style="margin:0 0 3px;font-size:13px;font-weight:700;color:#070f23;text-align:left;">Inquiry Review</p>
                        <p style="margin:0;font-size:13px;color:#5a6278;line-height:1.5;text-align:left;">One of our franchise advisors will review your inquiry and requirements in detail.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Arrow GIF -->
              <tr>
                <td>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td width="48" align="left" valign="top" style="padding:2px 0;width:48px;">
                        <img src="https://res.cloudinary.com/drewg2mlj/image/upload/v1779989485/GcmOqiCiR5-ezgif.com-gif-maker_ycrcav.gif" width="40" height="44" alt="↓" style="display:block;margin:0 4px;" />
                      </td>
                      <td></td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Step 2 -->
              <tr>
                <td>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td width="48" align="center" valign="top">
                        <table cellpadding="0" cellspacing="0" align="center">
                          <tr>
                            <td width="40" height="40" align="center" valign="middle" style="width:40px;height:40px;background:#070f23;border-radius:50%;text-align:center;vertical-align:middle;">
                              <span style="font-size:12px;font-weight:800;color:#f07920;font-family:Arial,sans-serif;display:block;line-height:40px;">02</span>
                            </td>
                          </tr>
                        </table>
                      </td>
                      <td valign="middle" style="padding:0 0 0 14px;">
                        <p style="margin:0 0 3px;font-size:13px;font-weight:700;color:#070f23;text-align:left;">Goal Discovery</p>
                        <p style="margin:0;font-size:13px;color:#5a6278;line-height:1.5;text-align:left;">We will reach out to understand your expansion goals, investment interests, and priorities in depth.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Arrow GIF -->
              <tr>
                <td>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td width="48" align="left" valign="top" style="padding:2px 0;width:48px;">
                        <img src="https://res.cloudinary.com/drewg2mlj/image/upload/v1779989485/GcmOqiCiR5-ezgif.com-gif-maker_ycrcav.gif" width="40" height="44" alt="↓" style="display:block;margin:0 4px;" />
                      </td>
                      <td></td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Step 3 -->
              <tr>
                <td>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td width="48" align="center" valign="top">
                        <table cellpadding="0" cellspacing="0" align="center">
                          <tr>
                            <td width="40" height="40" align="center" valign="middle" style="width:40px;height:40px;background:#f07920;border-radius:50%;text-align:center;vertical-align:middle;">
                              <span style="font-size:12px;font-weight:800;color:#ffffff;font-family:Arial,sans-serif;display:block;line-height:40px;">03</span>
                            </td>
                          </tr>
                        </table>
                      </td>
                      <td valign="middle" style="padding:0 0 0 14px;">
                        <p style="margin:0 0 3px;font-size:13px;font-weight:700;color:#070f23;text-align:left;">Path Alignment</p>
                        <p style="margin:0;font-size:13px;color:#5a6278;line-height:1.5;text-align:left;">We align you with the right expansion or investment path built around your specific business goals.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

            </table>

            <a href="https://xpandbharat.com/our-approach" style="display:inline-block;background:#f07920;color:#fff;font-size:13px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;padding:14px 32px;border-radius:6px;text-decoration:none;">Learn About Our Approach</a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8f9fc;padding:20px 40px;border-top:1px solid #e8eaf0;text-align:center;">
            <p style="margin:0;font-size:12px;color:#9ea5b8;line-height:1.6;">
              XPAND Bharat — Franchise Expansion &amp; Advisory<br>
              Gurugram, Haryana, India &nbsp;|&nbsp;
              <a href="https://xpandbharat.com" style="color:#f07920;text-decoration:none;">xpandbharat.com</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// POST /api/contacts  — public, rate limited
router.post('/', limiter, async (req, res) => {
  const { name, email, company, mobile, requirement, markets, message,
          role, primaryGoal, sector, geography, budget, timeline,
          consentReport, consentContact, source } = req.body;
  if (!name || !email) return res.status(400).json({ success: false, message: 'Name and email are required' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ success: false, message: 'Invalid email address' });
  try {
    // Build a readable requirement summary from the structured selections
    const requirementSummary = requirement?.trim()
      || [role, primaryGoal].filter(Boolean).join(' — ')
      || undefined;
    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      company: company?.trim(),
      mobile: mobile?.trim(),
      requirement: requirementSummary,
      markets: (markets || geography)?.trim(),
      message: message?.trim(),
      role: role?.trim(),
      primaryGoal: primaryGoal?.trim(),
      sector: sector?.trim(),
      geography: geography?.trim(),
      budget: budget?.trim(),
      timeline: timeline?.trim(),
      consentReport: !!consentReport,
      consentContact: !!consentContact,
      source: source?.trim(),
      ip: req.ip,
    });

    // Send emails (non-blocking — don't let mail failure block the response)
    const notifyTo = process.env.NOTIFY_EMAIL || 'contact@xpandbharat.com';
    setImmediate(async () => {
      try {
        await transporter.sendMail({
          from: `"XPAND Bharat Website" <${process.env.SMTP_USER}>`,
          to: notifyTo,
          replyTo: contact.email,
          subject: `New Inquiry from ${contact.name}${contact.company ? ` — ${contact.company}` : ''}`,
          html: buildNotificationEmail(contact),
        });
        await transporter.sendMail({
          from: `"XPAND Bharat" <${process.env.SMTP_USER}>`,
          to: contact.email,
          subject: 'We have received your inquiry — XPAND Bharat',
          html: buildConfirmationEmail(contact.name),
        });
      } catch (mailErr) {
        console.error('Email send error:', mailErr.message);
      }
    });

    res.status(201).json({ success: true, message: 'Message received. We will contact you within 48 hours.', id: contact._id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/contacts — admin only
// Sources produced by the multi-step role/goal lead form (business queries)
const LEAD_SOURCES = ['strategy-call', 'brochure-download'];

router.get('/', protect, async (req, res) => {
  const { status, search, view, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status && status !== 'all') filter.status = status;
  if (view === 'business') filter.source = { $in: LEAD_SOURCES };
  else if (view === 'contact') filter.source = { $nin: LEAD_SOURCES };
  if (search) {
    const r = new RegExp(search, 'i');
    filter.$or = [{ name: r }, { email: r }, { company: r }];
  }
  try {
    const [data, total, stats, businessCount, contactCount] = await Promise.all([
      Contact.find(filter).sort({ createdAt: -1 }).skip((page - 1) * +limit).limit(+limit),
      Contact.countDocuments(filter),
      Contact.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Contact.countDocuments({ source: { $in: LEAD_SOURCES } }),
      Contact.countDocuments({ source: { $nin: LEAD_SOURCES } }),
    ]);
    const statsMap = stats.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {});
    res.json({ success: true, data, total, stats: statsMap, viewCounts: { business: businessCount, contact: contactCount } });
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
