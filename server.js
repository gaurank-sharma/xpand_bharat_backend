require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

connectDB();

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth',     require('./routes/auth'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/insights', require('./routes/insights'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/page',     require('./routes/page'));
app.use('/api/content',  require('./routes/content'));

// Dashboard stats — public (no sensitive data)
app.get('/api/stats', async (_req, res) => {
  try {
    const Contact = require('./models/Contact');
    const Insight = require('./models/Insight');
    const [totalContacts, newContacts, publishedInsights] = await Promise.all([
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'new' }),
      Insight.countDocuments({ status: 'published' }),
    ]);
    res.json({ success: true, data: { totalContacts, newContacts, publishedInsights } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/', (_req, res) => res.json({ success: true, message: 'Xpand Bharat API is running' }));
app.get('/api/health', (_req, res) => res.json({ success: true, message: 'Xpand Bharat API is running' }));

app.use((_req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`\nXpand Bharat API → http://localhost:${PORT}\n`));
}

module.exports = app;
