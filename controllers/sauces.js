const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce); //on extrait l'objet JSON de "sauce"
    delete sauceObject._id // car mongoDB nous fournit un id (c'était req.body._id)
    const sauce = new Sauce({
        ...sauceObject, //copie les champs dans le corps de la requête
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save() //enregistre sauce dans la BDD et renvoie une promise
    .then(() => res.status(201).json({ message : 'Objet enregistré' }))
    .catch(error => res.status(400).json({ error }));
};

exports.like = (req, res, next) => {
    Sauce.findOne({ userId: req.body.userId })
    .then(sauce => {
        const id = req.body.userId;
        const like = req.body.like;
        let likeIndex = sauce.usersLiked.indexOf(id);
        let dislikeIndex = sauce.usersDisliked.indexOf(id);
        if (like == 1){
            if(likeIndex < 0){
                sauce.usersLiked.push(id);
                sauce.likes ++;
            }
        } else if (like == -1){
            if(dislikeIndex < 0){
                sauce.usersDisliked.push(id);
                sauce.dislikes ++;
            }
        } else {
            if(likeIndex > -1){
                sauce.usersLiked.splice(likeIndex, 1);
                sauce.likes --;
            } else {
                sauce.usersDisliked.splice(dislikeIndex, 1);
                sauce.dislikes --;
            }
        }
        sauce.save();
        res.status(201).json({sauce})
    })
    .catch(error => res.status(500).json({ error }))
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? //Pour vérifier si il y a une nouvelle image ou pas (opérateur ternaire)
    { 
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body }; //copie de req.body si le fichier n'existe pas
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message : 'Objet modifié' }))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink('images/${filename}', () => {
            Sauce.deleteOne({ _id: req.params.id})
            .then(() => res.status(200).json({ message: 'Objet supprimé' }))
            .catch(error => res.status(400).json({ error })) 
        })
    })
    .catch(error => res.status(500).json({ error}));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }))
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};