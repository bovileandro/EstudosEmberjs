module.exports = function (app) {
  var express = require('express');
  var aclRouter = express.Router();

  //
  // camada de persistência
  //
  var database = {
    "acl": [
      {
        "papel": "IndexDummy.DFincluir",
        "permitido": true
      },
      {
        "papel": "IndexDummy.DFalterar",
        "permitido": true
      },
      {
        "papel": "IndexDummy.DFexcluir",
        "permitido": false
      },
      {
        "papel": "IndexDummy.DFconsultar",
        "permitido": true				
      },
    ]
  }

  aclRouter.get('/', function(req, res) {
    res.send({'acl': database.acl});
  });

  app.use('/api/acl', aclRouter);
  
};