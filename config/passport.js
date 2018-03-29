//var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
const User = require('../model/user');
const bcrypt = require('bcrypt');

/*passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, function(err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }
));*/

module.exports = (passport)=> {
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback : true
        },
        (req,email, password, done) => {
            let query = {email: email};
            User.findOne(query).select('password').exec((err, user) => {
                if (err) {
                    throw err;

                }
                if (!user) {
                    return done(null, false, {message: 'No user found'});
                }

                console.log(user);
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user);
                    }
                    else {
                        return done(null, false, {message: 'Wrong password'});
                    }
                });
            });
        }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
};

