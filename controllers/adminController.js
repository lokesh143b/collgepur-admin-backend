const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Generate JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });

// Register new admin
// Allow only one admin to register
exports.registerAdmin = async (req, res) => {
  try {
    // Check if an admin already exists
    const existingAdmins = await Admin.countDocuments();
    if (existingAdmins > 0) {
      return res.status(403).json({
        message: "Admin already exists. Further registrations are not allowed.",
      });
    }

    const { name, email, password, title, description } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const newAdmin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      title,
      description,
    });

    // Send success response
    res.status(201).json({
      message: "Admin registered successfully",
      token: generateToken(newAdmin._id),
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    res.json({
      message: "Login successful",
      token: generateToken(admin._id),
      admin: { id: admin._id, name: admin.name, email: admin.email },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get logged-in admin details
exports.getAdminProfile = async (req, res) => {
  const { _id } = req.admin; //_id is comes from adminAuth.js middileware
  const admin = await Admin.findById({ _id });
  res.json({
    id: _id,
    name: admin.name,
    title: admin.title,
    description: admin.description,
  });
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin._id); //req.admin._id is comes from adminAuth.js middileware

    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: "Old password is incorrect" });

    // Hash new password
    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update admin by ID
exports.updateAdmin = async (req, res) => {
  try {
    const { name, title, description } = req.body;

    const updated = await Admin.findByIdAndUpdate(
      req.admin._id, //req.admin._id is comes from adminAuth.js middileware
      { name, title, description },
      { new: true }
    ).select("-password");

    if (!updated) return res.status(404).json({ message: "Admin not found" });

    res.json({ message: "Admin updated successfully", updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete admin by ID
exports.deleteAdmin = async (req, res) => {
  try {
    const deleted = await Admin.findByIdAndDelete(req.admin._id); //req.admin._id is comes from adminAuth.js middileware
    if (!deleted) return res.status(404).json({ message: "Admin not found" });
    res.json({ message: "Admin deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
