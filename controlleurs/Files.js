const fs = require('fs');
const File = require('../models/Files');
const multer = require('multer');
var path = require('path');
const __Config =require('../config.json');
const url = require("url");
const manageToken = require('../middleware/manageToken');
const FilesManager = require('../services/filesManager');



exports.filesList = async (req, res, next) => {
        const { email , urlrequest } = req.headers;
        try{
            let result = FilesManager.getFilesList(email,urlrequest);
            res.status(201).json({list : result.list, status : result.status})
        }catch(err){
            res.status(401).json({response : err , status : "error"})
        }        
};




exports.downloadFiles = async  (req, res,next) => {
    let url = req.headers.url
    let name = req.headers.name
    let manager = new manageToken();
    console.log(manager.decryptToken(req.headers.token));

    console.log(req.headers.url)
    console.log(req.headers.name)
    res.download(`C:/Users/anton/eclipse-workspace/FichierClient/antony64240@gmail.com/${url}/${name}.pdf`)
};


exports.UploadFile = async (req, res, next) => { 
    let query = url.parse(req.originalUrl, true).query.url;
    let tab = query.split('?');
    let token = getQueryStringValue('token','?'.concat(tab[2]));
    let user = getQueryStringValue('user','?'.concat(tab[1]));
    let current = getQueryStringValue('Currenturl','?'.concat(tab[0]));
    let manager = new manageToken();
    if (manager.verifyToken(manager.decryptToken(token))){
        let storage = multer.diskStorage({
            destination: `${__Config.Folder.path}${user}/${current}`
            ,
            filename: function (req, file, cb) {
                cb(null,file.originalname)
            }
        })
        var upload = multer({storage: storage}).array('file')
        

        console.log("upload");
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(500).json(err);
            } else if (err) {
                return res.status(500).json(err)
            }
            console.log("finish")
            return res.status(200).json({status : "success" , response: "Le dépot à été réalisé."})
        })
    }else{
        return res.status(401).json({message: "Token Invalid"})
    }
};



const getQueryStringValue =  (key,url) => {  
    return decodeURIComponent(url.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*+\#]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));  
}  
