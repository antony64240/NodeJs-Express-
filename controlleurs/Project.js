const ProjectShema = require('../models/projet');
const Users = require('../models/Users');
const mailSender = require('../services/mailSender');
let uuid = require('uuid');
const { jsPDF } = require('jspdf');
var encoding = require('encoding');
const fs = require('fs'); 
const img  = require('../models/image');
const __config = require('../config.json')

exports.createProject = async (req, res, next) =>
{
    let dataProject = new ProjectShema({  
        Author:req.body.email,   
        Name: req.body.nom,
        Description: req.body.descriptif,
        Date : new Date().valueOf(),
        DateExp : req.body.datefin,
        Valider : false,
        Devis : false,
        Token : uuid.v4()
      });
    ProjectShema.create(dataProject, function(err, search) {
        console.log(search)
        if(search!=null){
            Users.findOneAndUpdate({Email:req.body.email},{$push:{Project : search._id}}, function(err, update) {
                console.log(err)
                if(err) {              
                    return res.status(401).json({response: 'Erreur Interne, désolé du désagrément.', status: 'error'});
                } else {
                    new mailSender().sendProject(req.body.email,search,(success, err)=>{
                        if(err){
                            console.log(err)
                            return res.status(201).json({response: 'Erreur Interne, désolé du désagrément.', status: 'error'});
                        }else{
                            return res.status(201).json({response: 'Done.', status: 'success'});
                        }
                    })
                }
            });
        }else{
            return res.status(401).json({response: 'Erreur Interne.', status: 'error'});       
        }
    });
}


exports.getProjectbyUsers = async (req, res, next) =>
{
    Users.findOne({ Email : req.params.Email }).
        populate('Project').
            exec(function (err, story) {
                if (err) return handleError(err);
                return res.status(201).json({response: 'Done.', status: 'success', project: story});
    });
}


exports.getProject = async (req, res, next) =>
{   
    ProjectShema.findOne({ Token : req.params.token}, (err, search) => {
        if(err){
            return res.status(401).json({response: 'Projet introuvable.', status: 'error'});       
        }else{
            Users.findOne({Email: search.Author}, function(err, user) {
                if(err) {              
                    return res.status(401).json({response: 'Erreur Interne, désolé du désagrément.', status: 'error'});
                } else {
                    return res.status(201).json({response: 'Done.', status: 'success', project: search , user : user });
                }
            })
        }
    })
}



exports.createDevis = async (req, res, next) =>
{     
    let rows = req.body.data;
    let project = req.body.project;
    let user = req.body.user;

    ProjectShema.findById(project._id,(err, search)=>{
        search.Devis = true;
        search.Valider = true
        if(err){
            console.log(err)
            return res.status(401).json({response: 'Projet introuvable.', status: 'error'});
        }else{
            const doc = new jsPDF({
                unit: "pt",
                orientation: "p",
                lineHeight: 1.2
            });
            doc.setFontSize(12);
            doc.addImage(img , 'png', 0, 0, 650, 900);
            doc.text(`MEZZASALMA Christian`, 120, 70);
            doc.text(`Aix en Provence`, 140, 90);
            doc.text(`${new Date().getUTCDate()}`, 110, 197);
            doc.text(`${new Date().getMonth()+1}`, 130, 197);
            doc.text(`${new Date().getUTCFullYear()}`, 142, 197);
            doc.text(`${user.FirstName} ${user.LastName}`, 400, 70)
            doc.setFontSize(8);
            rows.forEach((elem , index) => {
                if(elem.price!=undefined && elem.heure !=undefined){
                    if(elem.description.length < 36){
                        doc.text(`-${elem.description}`, 70, 260+(25*index));
                    }else{
                        doc.text(`-${elem.description.substring(0, 55)}`, 70, 255+(25*index));
                        doc.text(`${elem.description.substring(55, 105)}`, 70, 263+(25*index));
                        doc.text(`${elem.description.substring(105, 150)}`, 70, 271+(25*index));
                    }
                    doc.text(`${elem.heure}h`, 300, 260+(25*index))
                    doc.text(`${elem.price}€/h`, 390, 260+(25*index))
                    doc.text(`${Math.floor(elem.heure*elem.price)}€`, 475, 260+(25*index))
                }
            });
            var data = doc.output()
            var buffer = encoding.convert(data, "Latin_1") 
            fs.writeFileSync(`${__config.Folder.path}${user.Email}/devis/${project._id}.pdf`, buffer, 'binary');
            ProjectShema.updateOne({_id:project._id}, search, (err, success)=>{
                if(err){
                    console.log(err)
                    return res.status(401).json({response: 'Erreur Interne, désolé du désagrément.', status: 'error'});     
                }else{
                    new mailSender().sendMailestimate(project.Author, project, (err,succes) =>{
                        if(err === null){
                            return res.status(401).json({response: 'Erreur Interne, désolé du désagrément.', status: 'error'});     
                        }else{
                            return res.status(401).json({response: 'Done.', status: 'success'});     
                        }
                    })
                }
            })
    
        }
    })  
    
}