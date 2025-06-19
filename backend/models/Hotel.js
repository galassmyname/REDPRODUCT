const mongoose = require('mongoose');

const CURRENCY_ENUM = ['XOF', 'EUR', 'USD'];

const HotelSchema = new mongoose.Schema({
  nom_de_l_hotel: { type: String, required: true },
  adresse: { type: String, required: true },
  email: { type: String, required: true },
  numero_de_telephone: { type: String, required: true },
  prix_par_nuit: { type: Number, required: true },
  devise: {
    type: String,
    enum: CURRENCY_ENUM,
    default: 'XOF'
  },
  photos: [String], // Ce seront les URLs des images stockées
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Hotel', HotelSchema);