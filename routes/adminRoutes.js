const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');

// Public
router.post('/register', adminCtrl.registerAdmin);
router.post('/login', adminCtrl.loginAdmin);

// Protected
router.get('/get-admin-data', adminAuth, adminCtrl.getAdminProfile);
router.put('/change-password', adminAuth, adminCtrl.changePassword);
router.put('/update', adminAuth, adminCtrl.updateAdmin);
router.delete('/delete', adminAuth, adminCtrl.deleteAdmin);

module.exports = router;
