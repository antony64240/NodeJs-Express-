const ORM = require('../services/ORM')

authentification = async (req, res, next) => {
    let Email = req.body.email,
        Password = req.body.password;
    try {
        let result = await ORM.authentification(Email, Password);
        res.status(201).json({response: result.response, status: result.status , token:result.token , user : result.user})
    }catch(err){
        res.status(401).json({response: err.response, status: err.status})
    }
}


forgotPassword = async (req, res, next) => {
    let Email = req.headers.email;
    try {
        await ORM.forgetPassword(Email)
        res.status(201).json({response: "Done", status: "success"})
    }catch (err) {
        res.status(401).json({response: err.response, status: err.status})
    }
}




recoverPassword = async (req, res, next) => {
    let token = req.body.token,
        Password = req.body.password;
    try {
        await ORM.recoverPassword(token , Password)
        res.status(201).json({response: "Done", status: "success"})
    }catch (err) {
        res.status(401).json({response: err.response, status: err.status})
    }
}


updateUser = async (req, res, next) => {
    try {
        await ORM.updateUser(req.body.User)
        res.status(201).json({response: 'Done.', status: 'success'});

    } catch (err) {
        res.status(401).json({response: 'Erreur Interne.', status: 'error'});
    }
}

module.exports = {
    updateUser,
    recoverPassword,
    forgotPassword,
    authentification
}