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

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});