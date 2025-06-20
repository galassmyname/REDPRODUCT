require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Routes
const authRoutes = require('./routes/auth.routes');
const hotelRoutes = require('./routes/hotel.routes');

const app = express();

// ===== Configuration CORS =====
// Autoriser uniquement ton frontend Netlify et localhost pour dev
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'https://superb-sprite-2ad929.netlify.app',
    'http://localhost:4200'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// ===== Middleware pour parser JSON =====
app.use(express.json());

// ===== Pour servir fichiers statiques =====
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===== Connexion MongoDB =====
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connecté à MongoDB'))
.catch(err => console.error('❌ Erreur MongoDB:', err));

// ===== Routes =====
app.use('/api/auth', authRoutes);
app.use('/api/hotels', hotelRoutes);

// ===== Middleware 404 =====
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint non trouvé' });
});

// ===== Port =====
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`🌍 Frontend autorisé: ${process.env.FRONTEND_URL || 'https://superb-sprite-2ad929.netlify.app'}`);
});
