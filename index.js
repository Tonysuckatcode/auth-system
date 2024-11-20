const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

// URL de base de Help Scout pour les Restricted Docs
const docsSiteUrl = 'https://docs.monsite.com'; // Remplace par l'URL réelle de ton site
const sharedSecret = 'VOTRE_SHARED_SECRET_ICI'; // Obtenu via Help Scout

// Fonction pour valider les identifiants
const isValidCredentials = (username, password) => {
    // Remplace cette validation par une requête à une base de données si nécessaire
    return username === 'Bayesmapdocs1' && password === 'krpYZdkui_bayesmap';
};

// Fonction pour créer un token JWT
const createToken = username => {
    const tokenPayload = {
        exp: Math.floor(Date.now() / 1000) + (60 * 60), // Expiration : 1 heure
        sub: username, // Sujet : le nom d'utilisateur
    };

    // Création du token signé
    return jwt.sign(tokenPayload, sharedSecret, { algorithm: 'HS512' });
};

// Middleware pour parser les requêtes URL-encoded
app.use(express.urlencoded({ extended: true }));

// Page de connexion
app.get('/signin', (req, res) => {
    const returnTo = req.query.returnTo || '/'; // Retourne à la page principale par défaut

    res.send(`
        <html>
            <head><title>Sign in</title></head>
            <body>
                <form method="post" action="/signin">
                    <input type="hidden" name="returnTo" value="${returnTo}" />
                    <p>
                        Nom d'utilisateur:<br />
                        <input type="text" name="username" required />
                    </p>
                    <p>
                        Mot de passe:<br />
                        <input type="password" name="password" required />
                    </p>
                    <p>
                        <input type="submit" value="Connexion" />
                    </p>
                </form>
            </body>
        </html>
    `);
});

// Endpoint POST pour gérer l'authentification
app.post('/signin', (req, res) => {
    const returnTo = req.body.returnTo || '/'; // Récupère la destination initiale
    const username = req.body.username; // Nom d'utilisateur soumis
    const password = req.body.password; // Mot de passe soumis

    if (isValidCredentials(username, password)) {
        // Génère le token JWT
        const token = createToken(username);

        // Redirige vers l'URL d'authentification de Help Scout
        const redirectUrl = `${docsSiteUrl}/authcallback?token=${token}&returnTo=${returnTo}`;
        res.redirect(redirectUrl);
    } else {
        // Redirige vers la page de connexion avec un message d'erreur
        res.send(`
            <html>
                <body>
                    <p>Nom d'utilisateur ou mot de passe incorrect. Veuillez réessayer.</p>
                    <a href="/signin">Retourner à la connexion</a>
                </body>
            </html>
        `);
    }
});

// Lancer le serveur
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
