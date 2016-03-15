var mysql = require('mysql');
var Promise = require('bluebird');
var MongoClient = require('mongodb').MongoClient;

function MySQLConnection(parameters, cb){
    var pool = mysql.createPool(parameters);
    var poolConnection;

    this.createConnection = function(){
        return new Promise(function(resolve, reject){
            pool.getConnection(function (err, connection) {
                if (err) return resolve(err);
                poolConnection = connection;
                resolve(cb(poolConnection));
            });
        });
    };

    this.releaseConnection = function(){
        if (poolConnection){
            //console.log('releasing mysql connection');
            //poolConnection.release();
            //mmm - just releasing the connection cause errors under high loads - replacing it with destroy for now
            poolConnection.destroy();
        }
    }
}

function MongoConnection(parameters, cb){
    var connection;

    this.createConnection = function(){
        return new Promise(function(resolve, reject){
            MongoClient.connect(parameters.url, function(err, db) {
                if (err) return resolve(err);
                connection = db;
                resolve(cb(db));
            });
        });
    }

    this.releaseConnection = function(){
        if (connection){
            connection.close();
        }
    }
}


module.exports = function (dbParams, servicesSetup) {

    if (!dbParams) throw Error('Database parameters not supplied');
        if (!servicesSetup) throw Error('Service setup callback not supplied');

    var databaseConnection;

    var setupProvider = function(req, res, next){

        var targetDatabase = dbParams['target-database'] || 'mysql';

        if (targetDatabase === "mysql"){
            databaseConnection =  new MySQLConnection(dbParams, servicesSetup);
        }
        else if (targetDatabase === "mongodb"){
            databaseConnection =  new MongoConnection(dbParams, servicesSetup);
        }
        else{
            console.log('invalid databse : ' + targetDatabase);
        }

        req.getServices = databaseConnection.createConnection;

		var end = res.end;
		res.end = function(data, encoding){
            try{
                databaseConnection.releaseConnection();
            }
            catch(err){
                console.log(err.stack);
            }

            res.end = end;
            res.end(data, encoding);
		};

		//
    	next();
    }

	return setupProvider;

};
