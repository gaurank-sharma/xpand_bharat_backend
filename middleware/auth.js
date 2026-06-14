const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Not authorised' });
  }
  try {
    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id).select('-password');
    if (!req.admin) return res.status(401).json({ success: false, message: 'Admin not found' });
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Only superadmins may manage members
const requireSuperadmin = (req, res, next) => {
  if (req.admin?.role !== 'superadmin') {
    return res.status(403).json({ success: false, message: 'Superadmin access required' });
  }
  next();
};

module.exports = { protect, requireSuperadmin };
