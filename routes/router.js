const express = require('express');
const router = express.Router()
const FileUser = require('../controlleurs/Files');
const SignUser = require('../controlleurs/Signup');
const AuthUser = require('../controlleurs/Auth');
const Project = require('../controlleurs/Project')
const { checkToken , verifyToken } = require("../controlleurs/TokenValidation");



//ANONYMOUS ROUTE
router.post('/AddUser', SignUser.createUsers);
router.post('/LoginUser', AuthUser.authentification);
router.get('/verifyEmail/:token', SignUser.verifyEmail);
router.post('/ForgotPassword', AuthUser.recoverPassword);
router.get('/ForgotPassword', AuthUser.forgotPassword);


//ADMINROUTE
router.get('/Users', SignUser.getUsers);
router.delete('/DeletUser/:id', SignUser.DeletOneUser);
router.post('/createpdf', Project.createDevis)


//USERROUTE
router.get('/Download', checkToken, FileUser.downloadFiles)
router.get('/ListFichier',checkToken, FileUser.filesList);
router.get('/CheckToken',verifyToken);
router.post('/UploadFile', FileUser.UploadFile);
router.post('/UpdateUser',checkToken, AuthUser.updateUser);
router.post('/newProject',checkToken, Project.createProject);
router.get('/getProject/:Email',checkToken, Project.getProjectbyUsers);
router.get('/Project/:token', Project.getProject );

module.exports = router;