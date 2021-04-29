const mongoose = require('mongoose');

const Users = mongoose.model(
  "Users",
  new mongoose.Schema({
    Password : { type : String , required : true},
    FirstName: { type: String},
    LastName: { type: String},
    Email: {
      type: String,
      lowercase: true,
      unique : true,
      required: [true, "ne peut être vide"],
      match: [/\S+@\S+\.\S+/, 'est invalide'],
      index: true
    },
    Phone: { type: Number },
    Areacode: { type: String},
    Phone: {type : String},
    City : {type : String},
    Address : {type : String},
    Compagny : {type : String},
    Token : {type : String},
    Project: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
      }
    ],
  })
);

module.exports = Users;