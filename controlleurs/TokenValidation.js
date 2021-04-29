const jwt = require("jsonwebtoken");
const manageToken = require('../middleware/manageToken');

module.exports = {
  checkToken: async (req, res, next) => {
    let token = req.headers.token
    if (token) {
        let manager = new manageToken();
        if (manager.verifyToken(manager.decryptToken(token))){
              console.log("token valid")
               next()
            } else {
              console.log("token invalid")
              return res.status(498).json({message: "Token Invalid"})
            }
    } else {
      return res.status(498).json({message: "Access Denied! Unauthorized User"})
    }
  },
  verifyToken: async (req, res, next) => {
    let token = req.headers.token;
    if (token) {
        
        let manager = new manageToken();
        if (manager.verifyToken(manager.decryptToken(token))){
          console.log("token valid")
          return res.status(201).json({message: "Token Valid"})
            } else {
              console.log("token invalid")
              return res.status(498).json({message: "Token Invalid"})
            }
    } else {
      return res.status(498).json({message: "Access Denied! Unauthorized User"})
    }
  }
}