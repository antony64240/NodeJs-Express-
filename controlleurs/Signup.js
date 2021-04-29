
const UserSchema = require('../models/Users');
const EmailValidator =require('email-validator');
const preRegisterSchema = require('../models/PreRegister');
const Escape = require('escape-html');
let uuid = require('uuid');
const  fs  = require('fs');
const __Config =require('../config.json');
const ORM = require('../services/ORM')


exports.createUsers = async (req, res, next) => {
  let { password , email } = req.body;
  try{
      let result = await ORM.createUser(password, email);
      res.status(200).json({ response : result.response , status : result.status })
  }catch(err){
      res.status(200).json({ response : err.response , status : err.status })
  }
};


exports.verifyEmail = async (req,res,next) => {
  let token = req.params.token
  console.log('im ere ')
  preRegisterSchema.findOne({Token:token}, function(err,search) {
    if (search != null){
      let dataUsers = new UserSchema({     
        Password: search.Password,
        Email: search.Email
      });
      UserSchema.create(dataUsers, function(err, created) {
        if(err){
          return res.status(200).json({response: 'Erreur lors de la validation de l\'email.', status:'error'});
        }else{
          preRegisterSchema.deleteOne({email:search.email}, function(err,deleted){
            if(err){
              return res.json({response: 'Error server', status:'error'});
            }else{
              fs.mkdir(`${__Config.Folder.path}${search.Email}`,function(e){
                if(e){
                } else {
                  fs.mkdir(`${__Config.Folder.path}${search.Email}/devis`,(e)=>{
                    if(err){
                      return res.json({response: 'Erreur lors de la création du fichier, contacter le support.', status:'Error'});
                    }else{
                      fs.mkdir(`${__Config.Folder.path}${search.Email}/facturation`,(e)=>{
                        if(e){
                          return res.json({response: 'Erreur lors de la création du fichier, contacter le support.', status:'Error'});
                        }else{
                         return res.json({response: 'Votre compte a bien été validé', status:'success'});
                        }
                      })
                    }
                  })
                }                
              });
            }
          })          
        }
      })
    }else{
      return res.json({response: 'Token déjà validé', status:'error'});
    }
  });
}


exports.getUsers = (req, res, next) => {
  req.headers.email
  UserSchema.findOne({email: mail}).then(
    (things) => {
      res.status(200).json(things);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );


 

  
};

exports.DeletOneUser = ('/:id', (req, res, next) => {
  UserSchema.deleteOne({_id: req.params.id}).then(
    () => {
      res.status(200).json({
        message: 'Deleted!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
});