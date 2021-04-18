const express = require('express');
const router = express.Router(); //création du routeur

const saucesCtrl = require('../controllers/sauces.js');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');//à mettre après auth dans la route

//traiter les requêtes POST
router.post('/', auth, multer, saucesCtrl.createSauce);
router.post('/:id/like', auth, multer, saucesCtrl.like);

//pour modifier un objet
router.put('/:id', auth, multer, saucesCtrl.modifySauce);

//route pour la suppression d'un objet
router.delete('/:id', auth, saucesCtrl.deleteSauce);

//middleware pour un seul objet
router.get('/:id', auth, saucesCtrl.getOneSauce);

//middleware avec pour premier argument l'url visée par l'application, aussi appeléé endpoint ou route; pour tous les objets
router.get('/', auth, saucesCtrl.getAllSauces);

module.exports = router;