const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const path = require('path');

passport.use(new LocalStrategy(
    (username, password, done) => {
        if (username === 'foo' && password === 'bar') {
            return done(null, { id: 1 });
        }

        return done(null, false, { message: 'Incorrect username/password' });
    }
));

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/');
}

let app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'keyboard cat'
}));
app.use(passport.initialize());
app.use(passport.session());

//app.use(app.router);

app.get('/', (req, res) => {
    res.render('index', { title: 'foo', message: 'bar' });
});

app.post('/login',
  passport.authenticate('local')
);

app.get('/secret', isAuthenticated, (req, res) => {
    res.send('This is secret');
});

module.exports = (porla) => {
    const port = porla.config.get([ 'web', 'port' ], 25456);

    app.listen(port, () => {
        porla.log('info', 'Porla web listening on port %d', port);
    });
};
