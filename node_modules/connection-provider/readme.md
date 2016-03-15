# Connection Provider

Express JS middleware that enables decoupling resources and components, making testing easier.

Only supporting mysql connections.

## How to use it:

```javascript

//In Express JS

var connectionProvider = require('connection-provider');

var mysqlDetails = {
      host: 'localhost',
      user: 'user_name',
      password: 'password',
      port: 3306,
      database: 'db_name'
};

var serviceSetupCallback = function(connection){
	return {
		serviceName : new ServiceName(connection),
    // you can inject other resources as well
		//processor : new Processor(new UpdateDetails(connection, io))
	}
};

app.use(connectionProvider(mysqlDetails, serviceSetupCallback));

//this adds a services object to request
app.get('/users', function(req, res){

  req.getServices()
        .then(function(services){
            var dataService = services.dataService;
            return dataService.getUsers()
        })
        .then(function(users){
            res.render('users', { users : users });
        });

});

```
