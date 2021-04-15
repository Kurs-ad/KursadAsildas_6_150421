//importation d'express
const express = require('express');
//importation de mongoose
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true); //empêche dépréciation node

//importation de helmet (entre autres, filtre les scripts intersites (XSS))
let helmet = require('helmet');

//donne accès aux chemins de notre système de fichiers
const path = require('path');

const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://Kursad:kursad@projet6oc.2xhij.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    { useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

//notre application, qui est une fonction qui va recevoir la requête et la réponse
const app = express();

app.use(helmet());

app.use(session({
    cookieName: 'sessionName',
    secret: "monsupersecret ",
    resave: false,
    saveUninitialized: true,
    httpOnly: true,  // dont let browser javascript access cookie ever
    secure: true, // only use cookie over https
    ephemeral: true // delete this cookie while browser close
 }));

//Empêcher les erreurs CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');//Permet d'accéder à notre API depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); //Permet d'ajouter les headers mentionnés aux requêtes envoyées vers notre API
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Permet d'envoyer des requêtes avec les méthodes mentionnées
    next();
});

app.use(express.json()); // transforme le corps de la requête en objet JS utilisable

app.use('/images', express.static(path.join(__dirname, 'images'))); //middleware qui sert le dossier images

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

//export de l'appli pour pouvoir y accéder depuis les autres fichiers, notamment serveur node
module.exports = app;