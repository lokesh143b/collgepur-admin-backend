const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

module.exports = async function (req, res, next) {

    const authHeader = req.header('Authorization');

  // Check if header is missing or doesn't contain "Bearer"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token. Access denied.' });
  }

  // Extract the token part only
  const token = authHeader.split(' ')[1];

  try {
    // Verify token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.id);

    // If admin not found
    if (!admin) {
      return res.status(403).json({ message: 'Admin not found. Unauthorized.' });
    }

    // Store admin details in request so it can be accessed in routes
    req.admin = admin;

    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token or unauthorized.' });
  }
};
