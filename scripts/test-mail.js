require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const nodemailer = require('nodemailer');

console.log('HOST:', process.env.SMTP_HOST, 'PORT:', process.env.SMTP_PORT, 'USER:', process.env.SMTP_USER, 'NOTIFY:', process.env.NOTIFY_EMAIL);

const t = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

(async () => {
  try {
    await t.verify();
    console.log('✓ SMTP verify OK');
    const info = await t.sendMail({
      from: `"XPAND Bharat Test" <${process.env.SMTP_USER}>`,
      to: process.env.NOTIFY_EMAIL || process.env.SMTP_USER,
      subject: 'SMTP test — XPAND Bharat',
      text: 'This is a test email to confirm SMTP works.',
    });
    console.log('✓ Sent:', info.messageId, '|', info.response);
  } catch (e) {
    console.error('✗ MAIL ERROR:', e.message);
  }
  process.exit(0);
})();
