const Users = require('../models/Users');
const preRegisterSchema = require('../models/PreRegister');
let uuid = require('uuid');
const mailSender = require('../services/mailSender');
const bcrypt = require('bcrypt');
const manageToken = require('../middleware/manageToken');

async function updateUser(User){
    return new Promise((acc,rej)=>{
        Users.findOne({Email: User.email}, function(err, search) {
            if(search!=null){
                search.FirstName=User.firstname;
                search.LastName=User.lastname;
                search.Phone=User.phone;
                search.Areacode=User.areacode;
                search.City=User.city;
                search.Address=User.address;
                search.Compagny=User.compagny;
                Users.updateOne({Email:search.Email},search, function(err, update) {
                    if(err) {              
                        return rej(err)
                    } else {
                        return acc();
                    }
                });
            }else{
                return rej(err);       
            }
        });
    })
}


async function forgetPassword(Email){
    return new Promise((acc,rej)=>{
        preRegisterSchema.findOne({Email: Email}, function(err, searchPreUser) {
            if(searchPreUser!=null){
                return rej({response: 'Cette adresse email est en attente de validation', status: 'error'})
            }else{
                Users.findOne({Email: Email}, function(err, search) {
                    if(search!=null){
                        search.Token = uuid.v4();
                        Users.updateOne({Email:search.Email},search, function(err, created) {
                            if(err) {              
                                return rej({response: 'Erreur Interne, désolé du désagrément.', status: 'error'});
                            } else {
                                new mailSender().sendPassword(search.Email,search.Token,(success,err)=>{
                                    if(err){
                                        return rej({response: 'Erreur Interne, désolé du désagrément.', status: 'error'});
                                    }else{
                                        return acc();
                                    }
                                });
                            }
                        });
                    }else{
                        return rej({response: 'Adresse Email introuvable.', status: 'error'});       
                    }
                });
            }
        });        
    })
}



async function authentification(Email, Password){
    return new Promise((acc,rej) => {
        if (! Email) {
            rej({response: 'Veuillez entrer votre Email', status: 'error'});
        } else {
            if (! Password) {
                rej({response: 'Veuillez entrer un mot de passe', status: 'error'});
            } else {
                preRegisterSchema.findOne({
                    Email: Email
                }, function (err, searchPreUser) {
                    if (err) {
                        rej({response: 'Erreur interne', status: 'error'});
                    } else {
                        if (searchPreUser == null) {
                            Users.findOne({
                                Email: Email
                            }, function (err, search) {
                                if (err) {
                                    rej({response: 'Erreur interne', status: 'error'});
                                } else {
                                    if (search != null) {
                                        bcrypt.compare(Password, search.Password, function (err, result) {
                                            if (err) {
                                                rej({status: 'error', response: 'Un problème interne est survenue'});
                                            } else {
                                                if (result === true) {
                                                    const userData = {
                                                        email: search.Email,
                                                        firstname: search.FirstName,
                                                        lastname: search.LastName,
                                                        phone: search.Phone,
                                                        areacode: search.Areacode,
                                                        city: search.City,
                                                        compagny: search.Compagny,
                                                        address: search.Address,
                                                        tokenExpiration: Date.now() + 3000000
                                                    }
                                                    acc({response: 'Vous êtes maintenant connecté', status: 'success', token: new manageToken().generateEncode(userData), user: userData});
                                                } else {
                                                    rej({response: 'Votre mot de passe est incorrect', status: 'error'});
                                                }
                                            }
                                        });
                                    } else {
                                        rej({response: 'Votre identifiant est incorrect', status: 'error'});
                                    }
                                }
                            });
                        } else {
                            rej({response: 'Cette adresse email est en attente de validation', status: 'error'});
                        }
                    }
                });
            }
        }
    })
}

async function recoverPassword(token , Password){
    return new Promise((acc,rej)=>{
        bcrypt.hash(Password, 10, function(err, hash){
            if (err) {
                rej({response: 'Erreur interne', status: 'error'});
            }else{
                Users.findOne({
                    Token : token
                }, (err, search)=>{
                    if(err){
                        rej({response: 'Token introuvable', status: 'error'});
                    }else{
                        search.Password = hash
                        // search.Token = ""
                        Users.updateOne({Email : search.Email} ,search, (err, success) => {
                            if(err){
                                rej({response: 'Erreur interne', status: 'error'});
                            }else{
                                acc({response: 'Done', status: 'success'})
                            }
                        })
                    }
                })
            }
        })
    })
}

async function createUser(email , password){
    return new Promise((acc,rej)=>{
        if(!email){
            rej({response : 'Veuillez entrer une adresse mail' , status: '201'});
        } else {
            if(!EmailValidator.validate(email)){
                rej({ response : 'Votre adresse mail est incorrect', status: '201'});
            } else {
            if(password.length > 7 ){
                preRegisterSchema.findOne({Email:Escape(email)}, (err,search) => {
                if(search==null){
                    UserSchema.findOne({Email: Escape(email)}, function(err, searchemail) {
                        if(err) {
                            rej({response: 'Un problème interne est survenue', status: 'error'});
                        } else {
                            if(searchemail == null) {
                            let dataUsers = new preRegisterSchema({     
                                    Password: password,
                                    Email: escape(email),
                                    Token : uuid.v4()
                                });
                                preRegisterSchema.create(dataUsers, function(err, created) {
                                    if(err) {              
                                        rej({response: err.message, status: 'error'});
                                    } else {
                                        let dataUserPublic = {
                                        Password: password,
                                        Email: escape(email)
                                        }
                                        acc({response: 'Votre compte a bien été créé', user: dataUserPublic, status:'success'});
                                    }
                                    });
                            } else {
                                rej({response: 'Cette adresse email est déjà utilisé', status: 'error'});
                            }
                        }
                        });
                    }else{
                        rej({response: 'Cette adresse email est en attente de validation', status: 'error'});
                    }
                    });
            }else{
                rej({response: 'Le mot de passe doit au moins 8 caractères', status: '201'}); 
            }  
        }
        }
    }); 
}

module.exports={
    updateUser,
    forgetPassword,
    authentification,
    recoverPassword,
    createUser
}