var express = require('express');
var router = express.Router();

var User = require('../model/user');


/* GET users listing. */
router.get('/getall', (req, res, next) => {
  User.find({},function (err, users) {
    if(err){
      console.log(err);
    }
    else {
        res.render('users', {users: users});
    }
  });
});



router.get('/addUser', (req,res,next)=>{
    res.render('addUser');
});



router.post('/addUser', (req,res,next)=>{
  let user =new User();

  user.name = req.body.name;
  user.email = req.body.email;

  console.log(user);

  user.save((err)=>{
    if(err){
      console.log(err);
      return;
    }
    else{
      res.redirect('/');
    }
  });
});

module.exports = router;
