const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const mailSender = require('../services/mailSender');


var preRegisterSchema = mongoose.Schema({
  Password : { type : String , required : true},
  Token : { type : String, required : true},
  Email: {
    type: String,
    lowercase: true,
    unique : true,
    required: [true, "ne peut être vide"],
    match: [/\S+@\S+\.\S+/, 'est invalide'],
    index: true
  }
});


preRegisterSchema.pre('save', function(next){
  var user = this;
  bcrypt.hash(user.Password, 10, function(err, hash){
      if (err) {
          return next(err);
      }
      user.Password = hash;
      new mailSender().sendMail(user.Email,user.Token,(success,err)=>{
        if(err){
          console.log(err)
        }else{
          console.log(success)
        }
      });
      next();
  })
});

const preRegister = mongoose.model('PreRegister', preRegisterSchema);

module.exports = preRegister;