const dotenv = require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

const app = express();
const port = 3000;


const CLIENT_ID_GITHUB = process.env.CLIENT_ID_GITHUB;
const CLIENT_SECRET_GITHUB = process.env.CLIENT_SECRET_GITHUB;

passport.use(new GitHubStrategy({
  clientID: CLIENT_ID_GITHUB,
  clientSecret: CLIENT_SECRET_GITHUB,
  callbackURL: "http://localhost:3000/auth/github/callback"
},
function(accessToken, refreshToken, profile, done) {
  return done(null, profile);
}
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.use(session({ 
    secret:'keyboard',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  const html = "<a href='/auth/github'>Login con GitHub</a>";  
  res.send(html);
});

app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] })
);

app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/profile');
    }
);

// Middleware de autenticación
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

// Ruta con middleware
app.get('/profile', ensureAuthenticated, (req, res) => {
    res.send(`Hola ${req.user.username || req.user.displayName}`);
});

app.get('/logout', (req, res) => {
    req.logout(done => {
        console.log('Usuario deslogueado');
    });
    res.redirect('/');
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
