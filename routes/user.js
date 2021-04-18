const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup); // pas besoin de auth et multer car on s'authentifie
router.post('/login', userCtrl.login); //auth ne doit pas être présent

module.exports = router;