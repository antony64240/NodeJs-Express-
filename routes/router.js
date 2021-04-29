const express = require('express');
const router = express.Router()
const FileUser = require('../controlleurs/Files');
const SignUser = require('../controlleurs/Signup');
const AuthUser = require('../controlleurs/Auth');
const Project = require('../controlleurs/Project')
const { checkToken , verifyToken } = require("../controlleurs/TokenValidation");



//ANONYMOUS ROUTE
router.post('/', SignUser.createUsers);
router.post('/', AuthUser.authentification);
router.get('//:token', SignUser.verifyEmail);
router.post('/', AuthUser.recoverPassword);
router.get('/', AuthUser.forgotPassword);


//ADMINROUTE
router.get('/', SignUser.getUsers);
router.delete('//:id', SignUser.DeletOneUser);
router.post('/', Project.createDevis)


//USERROUTE
router.get('/', checkToken, FileUser.downloadFiles)
router.get('/',checkToken, FileUser.filesList);
router.get('/',verifyToken);
router.post('/', FileUser.UploadFile);
router.post('/',checkToken, AuthUser.updateUser);
router.post('/',checkToken, Project.createProject);
router.get('//:Email',checkToken, Project.getProjectbyUsers);
router.get('//:token', Project.getProject );

module.exports = router;
