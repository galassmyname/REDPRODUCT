const Hotel = require('../models/Hotel');
const multer = require('multer');
const path = require('path');

// === Config Multer ===
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'hotel-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images only! (JPEG, JPG, PNG, GIF)');
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
}).single('photo');

// Middleware d'upload
exports.uploadHotelPhoto = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError || err) {
      return res.status(400).json({ success: false, error: err.message || err });
    }
    next();
  });
};

// === Créer un hôtel ===
exports.createHotel = async (req, res) => {
  try {
    const requiredFields = ['nom_de_l_hotel', 'adresse', 'email', 'numero_de_telephone', 'prix_par_nuit'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ success: false, error: `Le champ ${field} est requis` });
      }
    }

    const prix_par_nuit = parseFloat(req.body.prix_par_nuit);
    if (isNaN(prix_par_nuit)) {
      return res.status(400).json({ success: false, error: 'Le prix par nuit doit être un nombre valide' });
    }

    const hotelData = {
      nom_de_l_hotel: req.body.nom_de_l_hotel,
      adresse: req.body.adresse,
      email: req.body.email,
      numero_de_telephone: req.body.numero_de_telephone,
      prix_par_nuit,
      devise: req.body.devise || 'XOF'
    };

    // 🔥 Enregistrer l'image comme URL complète
    if (req.file) {
      hotelData.photos = [`https://redproduct.onrender.com/uploads/${req.file.filename}`];
    }

    const newHotel = new Hotel(hotelData);
    await newHotel.save();

    res.status(201).json({ success: true, data: newHotel, message: 'Hôtel créé avec succès' });

  } catch (err) {
    console.error('Erreur création hôtel:', err);
    res.status(400).json({ success: false, error: err.message });
  }
};

// === Liste des hôtels ===
exports.getHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find();

    const hotelsWithFullUrls = hotels.map(hotel => {
      const fullPhotos = (hotel.photos || []).map(photo => {
        const filename = path.basename(photo); // extrait juste le nom de fichier
        return `https://redproduct.onrender.com/uploads/${filename}`;
      });
      return {
        ...hotel._doc,
        photos: fullPhotos
      };
    });

    res.status(200).json(hotelsWithFullUrls);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// === Détails d’un hôtel ===
exports.getHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hôtel non trouvé' });
    }
    res.status(200).json({ success: true, data: hotel });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// === Mise à jour ===
exports.updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hôtel non trouvé' });
    }

    res.status(200).json({ success: true, data: hotel });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// === Suppression ===
exports.deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hôtel non trouvé' });
    }
    res.status(200).json({ success: true, message: 'Hôtel supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
