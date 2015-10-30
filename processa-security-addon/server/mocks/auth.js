module.exports = function(app) {
  var express = require('express');
  var authRouter = express.Router();

  authRouter.get('/', function(req, res) {
    res.send({'autenticado': true});
  });

  app.use('/api/auth', authRouter);
  
};
