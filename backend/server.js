const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.routes');
const hotelRoutes = require('./routes/hotel.routes');
const path = require('path');

dotenv.config();

const app = express();

// Middleware CORS avec configuration spécifique
app.use(cors({
  origin: 'http://localhost:4200', // L'URL de ton frontend Angular
  credentials: true
}));

// Middleware pour parser le JSON
app.use(express.json());

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
