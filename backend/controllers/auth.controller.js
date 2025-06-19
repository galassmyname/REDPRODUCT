const Admin = require('../models/Admin');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret';

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Admin déjà inscrit" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ name, email, password: hashedPassword });

    await newAdmin.save();
    res.status(201).json({ message: "Admin inscrit avec succès" });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: err.message || "Erreur lors de l'inscription" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin introuvable" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ 
      token, 
      admin: { 
        id: admin._id, 
        name: admin.name, 
        email: admin.email 
      } 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message || "Erreur lors de la connexion" });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Email non trouvé' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.EMAIL_PASSWORD,
      }
    });

const resetLink = `http://localhost:4200/reset-password/${token}`;

    await transporter.sendMail({
      from: `"Support Admin 👨‍💼" <${process.env.EMAIL_SENDER}>`,
      to: email,
      subject: "Réinitialisation de mot de passe",
      html: `
        <h3>Réinitialisation de mot de passe</h3>
        <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
        <a href="${resetLink}">${resetLink}</a>
      `
    });

    res.status(200).json({ message: "Email envoyé avec succès" });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: "Erreur lors de l'envoi de l'email de réinitialisation" });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const hashedPassword = await bcrypt.hash(password, 10);
    await Admin.findByIdAndUpdate(userId, { password: hashedPassword });

    res.status(200).json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(400).json({ message: "Lien expiré ou invalide" });
  }
};