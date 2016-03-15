var qr = require('qr-image');  
var express = require('express');
var exphbs  = require('express-handlebars');
//var mysql = require('mysql'),
cookieParser = require('cookie-parser');
bodyParser = require('body-parser'),
myConnection = require('express-myconnection');
session = require('express-session');
var cookieSession =require('cookie-session');
//var bcrypt = require('bcrypt');
var request = require('request');
//Users ifo is required from  js to server-side
var loggin = require('./routes/login');
 var register = require('./routes/Users');
 var usrs =require('./routes/Users');



var app = express();
app.use(express.static('public'));
//app.use(myConnection(mysql, dbOptions, 'single'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({secret : 'coder123', resave : true,   saveUninitialized: true, cookie: { maxAge: 60000*15 }}));



//Qr Code Image Scanner
app.get('/scann', function(req, res) {  
	var code = qr.image(new Date().toString(), { type: 'svg' });
	res.type('svg');
	code.pipe(res);
});

// Render the QR code on a newly created img element
var img = qr.image('http://neocotic.com/qr.js');
// Re-render the QR code on an existing element
qr.image({
  image: img,
  value: 'https://github.com/neocotic/qr.js'
});

///Example2
var express = require('express');
var router = express.Router();
var qr = require('qr-image');

router.get('/', function(req, res) {
    var code = qr.image("text to show in qr", { type: 'png', ec_level: 'H', size: 10, margin: 0 });
    res.type('png');
    code.pipe(res);
    // res.render('index', { title: 'QR Page', qr: code });
});//End example

//example3
// Render a QR code to a PNG file 
qr.save('http://neocotic.com/qr.js', 'qr.png', function(err) {
  if (err) throw err;
 
  // ... 
});
// Render a QR code to a JPEG file 
qr.save({
  mime: 'image/jpeg',
  path: 'qr.jpg',
  value: 'https://github.com/neocotic/qr.js'
}, function(err) {
  if (err) throw err;
 
  // ... 
});

//End 3

//End of Qr Code

app.use(function(req, res, next){
  console.log('in my middleware!');
  //proceed to the next middleware component
  next();
});

//Checking user's
var checkUser = function(req, res, next){
  console.log("path : " + req.path);
  if (req.session.user){

    var pathNeedsAdminRights = contains(req.path, "add") || 
          contains(req.path, "edit") || 
          contains("delete");

    if(pathNeedsAdminRights && req.session.role !== "Admin"){
      //why is there are error
      res.send(500, "ACCESS DENIED");
    }

    return next();
  }


  // the user is not logged in redirect them to the login page
  res.redirect('/login');
};


///USER'S Login And Signup If doesn't have Account Line 30-49
app.get('/users', function(req, res){
	var userData = userService.getUserData();
	res.render('users', userData)
});


app.get('/home', function (req, res) {
	res.render('home');
});

 app.post('/home', loggin.login);

app.get('/login', function (req, res) {
	res.render('login', {layout: false})
});

// app.get('/loginn', function(req, res){
// 	res.render('login', {layout: false});
// });



///LogOut Use OR Session End
app.get('/logout', function(req, res){
	delete req.session.user;
	res.redirect('/login');

});

app.get('/signup', function(req, res){
	app.post('/signup', function(req, res){
		var user = JSON.parse(JSON.stringify(req.body));
		if(user.password === user.confirm_password){
			if(user[user.username] === undefined){
				user[user.username] = user.password;
				res.redirect('/login');
			}
		}
		res.render('signup');
	});
});	



//   app.get('/signup', function(req, res){
//   res.render('signup', {layout: false})
// });
  // app.get('/signup', register.get);
  app.post('/signup', register.add);
app.get('/signup', register.get);
app.get('/signup/edit/:id', register.get);
app.post('/signUp/update/:id', register.update);
app.post('/signup/add', register.add);
//this should be a post but this is only an illustration of CRUD - not on good practices
app.get('/signup/delete/:id', register.delete);

app.listen(3000);  