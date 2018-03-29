var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var passport = require('passport');

var User = require('../model/user');


/* GET users listing. */
router.get('/getall', authenticateRoute, (req, res, next) => {
    User.find({}, function (err, users) {
        if (err) {
            console.log(err);
        }
        else {
            res.render('users', {users: users});
        }
    });
});


router.get('/register', (req, res, next) => {
    res.render('register');
});


router.post('/register', (req, res, next) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err) {
                console.log(err);
                return res.render('register', {message: 'Error in password'});
            }
            user.password = hash;
            console.log(hash);

            console.log(user);

            user.save((err) => {
                if (err) {
                    console.log(err);
                    if (err.message.includes('duplicate key error'))
                        res.render('addUser', {message: 'Email already exist'});
                    else
                        res.render('addUser', {message: 'error'});
                }
                else {
                    res.redirect('/users/getAll');
                }
            });
        });
    });


});


router.get('/editUser/:email',authenticateRoute, (req, res, next) => {
    User.findOne({email: req.params.email}, (err, user) => {
        if (err) {
            console.log(err);
            res.render('users', {message: 'Error'});
        }
        else {
            res.render('editUser', {user: user});
        }
    });
});


router.post('/editUser/:email',authenticateRoute , (req, res, next) => {
    User.findOneAndUpdate({email: req.params.email}, {$set: {name: req.body.name}}, {new: true}, (err, user) => {
        if (err) {
            console.log(err);
            res.render('editUser', {message: 'Error'});
        }
        else {
            res.redirect('/users/getAll');
        }
    });
});

router.get('/deleteUser/:email',authenticateRoute, (req, res, next) => {
    User.findOneAndRemove({email: req.params.email}, (err, user) => {
        if (err) {
            console.log(err);
            res.render('editUser', {message: 'Error'});
        }
        else {
            res.redirect('/users/getAll');
        }
    });
});

router.get('/login', (req, res, next) => {
    res.render('login');
});


/*router.post('/login', passport.authenticate('local', {
    successRedirect : '/users/getAll',
    failureRedirect : '/users/addUser'
}));*/


router.post('/login', (req,res,next)=>{
    passport.authenticate('local', {
        successRedirect : '/',
        failureRedirect : '/users/addUser'
    })(req,res,next);
});

router.get('/logout',(req,res,next)=>{
   req.logout();
   res.redirect('/');
});

function authenticateRoute(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        res.render('login',{message:'Please login'});
    }
}

module.exports = router;
