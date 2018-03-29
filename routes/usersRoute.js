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
      if(err.message.includes('duplicate key error'))
        res.render('addUser', {message:'Email already exist'});
      else
        res.render('addUser', {message:'error'});
    }
    else{
      res.redirect('/');
    }
  });
});


router.get('/editUser/:email', (req,res,next)=>{
  User.findOne({email:req.params.email}, (err, user) =>{
    if(err){
      console.log(err);
      res.render('users',{message:'Error'});
    }
    else{
      res.render('editUser', {user:user});
    }
  });
});


router.post('/editUser/:email', (req,res,next)=>{
  User.findOneAndUpdate({email:req.params.email}, {$set:{name:req.body.name}},{new:true},(err,user)=>{
    if (err) {
        console.log(err);
        res.render('editUser', {message:'Error'});
    }
    else{
        res.redirect('/users/getAll');
    }
  });
});

router.get('/deleteUser/:email', (req,res,next)=>{
  User.findOneAndRemove({email:req.params.email},(err,user)=>{
    if(err){
        console.log(err);
        res.render('editUser', {message:'Error'});
    }
    else{
        res.redirect('/users/getAll');
    }
  });
});

module.exports = router;
