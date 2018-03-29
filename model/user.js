const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:{type:String, select:false}
});

var User = mongoose.model('User', userSchema);

module.exports =User;