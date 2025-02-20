const dotenv = require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

const app = express();
const port = 3000;

// Configuración de la sesión
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));

// Inicializar passport
app.use(passport.initialize());
app.use(passport.session());

// Configuración de la estrategia de GitHub
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/github/callback"
},
function(accessToken, refreshToken, profile, done) {
  // Aquí puedes manejar el perfil del usuario
  return done(null, profile);
}));

// Serializar y deserializar el usuario
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Ruta principal
app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

// Ruta de autenticación con GitHub
app.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

// Ruta de callback de GitHub
app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    // Autenticación exitosa
    res.redirect('/');
  }
);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});