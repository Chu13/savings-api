const express      = require('express');
const logger       = require('morgan');
const bodyParser   = require('body-parser');
const mongoose     = require('mongoose');
const cors         = require('cors')
mongoose.Promise = Promise;

mongoose.connect('mongodb://localhost/savings-app')
  .then(() => {
    console.log("Mongoose is connected! 🦑");
  })
  .catch((err) => {
    console.log("Mongoose connection FAILED! 🚨🚨🚨🚨🚨🚨🚨🚨🚨");
    console.log(err);
  });

const app = express();


// default value for title local
// app.locals.title = 'Express - Generated with IronGenerator';



app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cors({
    // accept cookies across domains
    credentials: true,
    // ONLY allow these domains to connect
    origin: ['https://dev-savings-app.firebaseapp.com','http://localhost:8080']
  })
);

app.use('/api', require('./routes/user'));



module.exports = app;
