var express = require('express');
var app = express();
var connectionProvider = require('../index.js');

var dbOptions = {
    'target-database' : "mongodb",
    url : "mongodb://localhost:27017/connections"
};


var MongoService = function(db){
  this.users = function(cb){
      var users = db.collection('users');
      users.find({}).toArray(cb);
  };
};

var serviceSetupCallback = function(connection){
	return {
		userService : new MongoService(connection),
	}
};

app.use(connectionProvider(dbOptions, serviceSetupCallback));

app.get('/', function (req, res, next) {
  req.getServices()
  .then(function(services){
      var userService = services.userService;
      userService.users(function(err, users){
          if (err) return next(err);
          res.send(users);
      });
  });
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
