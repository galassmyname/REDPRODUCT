require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Routes
const authRoutes = require('./routes/auth.routes');
const hotelRoutes = require('./routes/hotel.routes');

// Initialisation de l'app Express
const app = express();

// =============================================
// 1. Configuration CORS (Critique pour Render)
// =============================================
app.use(cors({
  origin: [
    process.env.FRONTEND_URL, // Ex: 'https://votre-frontend.onrender.com'
    'http://localhost:4200'   // Dev Angular
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'] // Méthodes autorisées
}));

// =============================================
// 2. Middlewares
// =============================================
app.use(express.json()); // Pour parser le JSON
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Fichiers statiques

// =============================================
// 3. Connexion MongoDB (Critique pour Render)
// =============================================
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ Connecté à MongoDB'))
  .catch(err => console.error('❌ Erreur MongoDB:', err));

// =============================================
// 4. Routes (Vérifiez les chemins !)
// =============================================
app.use('/api/auth', authRoutes); // Toutes les routes /api/auth/*
app.use('/api/hotels', hotelRoutes); // Toutes les routes /api/hotels/*

// =============================================
// 5. Gestion des erreurs 404 (Important pour Render)
// =============================================
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint non trouvé' });
});

// =============================================
// 6. Configuration du port pour Render (Critique !)
// =============================================
const PORT = process.env.PORT || 10000; // Render utilise le port 10000

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`🔗 URL backend: http://localhost:${PORT}`);
  console.log(`🌍 Frontend autorisé: ${process.env.FRONTEND_URL || 'http://localhost:4200'}`);
});