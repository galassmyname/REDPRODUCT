const Hotel = require('../models/Hotel');
const multer = require('multer');
const path = require('path');

// Configuration de Multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'hotel-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtrage des fichiers pour n'accepter que les images
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
  limits: { fileSize: 5 * 1024 * 1024 } // Limite à 5MB
}).single('photo'); // Modification ici - un seul fichier avec le champ 'photo'

// Middleware pour gérer l'upload
exports.uploadHotelPhoto = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ 
        success: false,
        error: err.message 
      });
    } else if (err) {
      return res.status(400).json({ 
        success: false,
        error: err 
      });
    }
    next();
  });
};

exports.createHotel = async (req, res) => {
  try {
    // Vérifiez que les champs requis sont présents
    const requiredFields = ['nom_de_l_hotel', 'adresse', 'email', 'numero_de_telephone', 'prix_par_nuit'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          success: false,
          error: `Le champ ${field} est requis`
        });
      }
    }

    // Conversion du prix en nombre
    const prix_par_nuit = parseFloat(req.body.prix_par_nuit);
    if (isNaN(prix_par_nuit)) {
      return res.status(400).json({
        success: false,
        error: 'Le prix par nuit doit être un nombre valide'
      });
    }

    const hotelData = {
      nom_de_l_hotel: req.body.nom_de_l_hotel,
      adresse: req.body.adresse,
      email: req.body.email,
      numero_de_telephone: req.body.numero_de_telephone,
      prix_par_nuit: prix_par_nuit,
      devise: req.body.devise || 'XOF'
    };

    // Traitement du fichier uploadé
    if (req.file) {
      hotelData.photos = ['/uploads/' + req.file.filename];
    }

    const newHotel = new Hotel(hotelData);
    await newHotel.save();
    
    res.status(201).json({
      success: true,
      data: newHotel,
      message: 'Hôtel créé avec succès'
    });
    
  } catch (err) {
    console.error('Erreur création hôtel:', err);
    res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
};
// Les autres fonctions (getHotels, getHotel, updateHotel, deleteHotel) restent inchangées
exports.getHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find();
    // Transformez les chemins des images en URLs absolues
    const hotelsWithFullUrls = hotels.map(hotel => {
      if (hotel.photos && hotel.photos.length > 0) {
        return {
          ...hotel._doc,
          photos: hotel.photos.map(photo => {
            // Si le chemin commence déjà par /uploads/, ne rien changer
            if (photo.startsWith('/uploads/')) return photo;
            // Sinon, ajouter le préfixe
            return `https://redproduct.onrender.com/uploads/${photo.replace('uploads/', '')}`;
          })
        };
      }
      return hotel;
    });
    
    res.status(200).json(hotelsWithFullUrls);
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

exports.getHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ 
        success: false,
        message: 'Hôtel non trouvé' 
      });
    }
    res.status(200).json({
      success: true,
      data: hotel
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

exports.updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { 
      new: true,
      runValidators: true 
    });
    
    if (!hotel) {
      return res.status(404).json({ 
        success: false,
        message: 'Hôtel non trouvé' 
      });
    }
    
    res.status(200).json({
      success: true,
      data: hotel
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
};

exports.deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    
    if (!hotel) {
      return res.status(404).json({ 
        success: false,
        message: 'Hôtel non trouvé' 
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Hôtel supprimé avec succès'
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};