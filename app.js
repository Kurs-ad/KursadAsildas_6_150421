//importation d'express
const express = require('express');
//importation de mongoose
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true); //empêche dépréciation node
//importation de dotenv
require('dotenv').config();
let user = process.env.USER;
let password = process.env.PASS;

//importation de helmet (entre autres, filtre les scripts intersites (XSS))
let helmet = require('helmet');

let session = require('cookie-session');

const Ddos = require('ddos');
const ddos = new Ddos;

//donne accès aux chemins de notre système de fichiers
const path = require('path');

const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://'+user+':'+password+'@projet6oc.2xhij.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    { useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

//notre application, qui est une fonction qui va recevoir la requête et la réponse
const app = express();

app.use(ddos.express);
app.use(helmet());

let expiryDate = new Date( Date.now() + 60 * 60 * 1000 ); // 1 hour
app.use(session({
    name: 'nom de session pas par défaut',
    keys: ['key1', 'key2'], //Liste des clés utilisées pour authentifier et vérifier les cookies
    cookie: { secure: true, //Garantit que le navigateur n’envoie le cookie que sur HTTPS
            httpOnly: true, //Garantit que le cookie n’est envoyé que sur HTTP(S), pas au JavaScript du client, ce qui renforce la protection contre les attaques de type cross-site scripting.
            domain: 'example.com', //Indique le domaine du cookie ; utilisez cette option pour une comparaison avec le domaine du serveur dans lequel l’URL est demandée. S’ils correspondent, vérifiez ensuite l’attribut de chemin.
            path: 'foo/bar', //Indique le chemin du cookie ; utilisez cette option pour une comparaison avec le chemin demandé. Si le chemin et le domaine correspondent, envoyez le cookie dans la demande.
            expires: expiryDate //Définit la date d’expiration des cookies persistants.
          }
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