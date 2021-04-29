const express = require('express');
const __Config =require('./config.json');
const mongoose = require('mongoose');
var cors = require('cors');
const route = require('./routes/router');
const path  = require('path')


mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.connect(`mongodb+srv://${__Config.Mongoose.login}:${__Config.Mongoose.mdp}@cluster0.wcjzr.mongodb.net/<dbname>?retryWrites=true&w=majority`,


  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


const app = express();

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });


  app.use(cors());
  app.use('/', express.static(path.join(__dirname, '../build')));
  
  app.use(express.json()); // for parsing application/json
  app.use(express.urlencoded({ extended: true })); 

  app.use('/api/', route);




  module.exports = app;