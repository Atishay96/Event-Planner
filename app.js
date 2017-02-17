var express = require('express');
var http = require('http');
var fs = require('fs');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var multer =require('multer');
var index = require('./routes/index');
var newa = require('./routes/new');
var view = require('./routes/view');
var number = 0;
var app = express();
mongoose.connect('mongodb://localhost/user');
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error:')); 
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//upload directory
//app.use(express.bodyParser({uploadDir:'C:/db/task1/public/images'}));

app.use('/', index);
app.use('/new', newa);
app.use('/view', view);

// app.use(function(req,res,next){
//   res.header('Access-Control-Allow-Origin',"*");
//   res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
//   res.header('Access-Control-Allow-Headers','Content-Type');
//   next();
// });

db.once('open',function(){
	console.log("DataBase Connected");
});

var EventSchema = mongoose.Schema ({
      Type: String,
    	Name: String,
    	Email: String,
    	Phone: String,
    	Address: String,
      Lat: String,
      Lng: String,
      ImageSchema: [{type: mongoose.Schema.ObjectId, ref:'ModelI'}]
});

var ImageSchema = mongoose.Schema({
    id: String,
    FieldName: String,
    OName: String,
    Mimetype: String,
    Path: String
});


EventSchema.methods.mess = function(){
		var greeting = 'Entry Saved';
		console.log(greeting);
};

EventSchema.methods.Pheobe = function(){
  var greeting = 'Image details Stored!';
  console.log(greeting);
};


var Modelo = mongoose.model('oyo', EventSchema, 'oyo');
var ModelI = mongoose.model('yoy', ImageSchema, 'yoy');

var storage = multer.diskStorage({
    destination: function(req,file,cb){
      cb(null,'./public/images/')
    },
    filename: function(req,file,cb){
      cb(null,file.originalname);
    }
});

var upload = multer({ storage:storage  });

app.post('/save',upload.any(),function(req,res){
  console.log("done till here");
  //var ext = path.extname(req.files.filename);
  var fluffy = new Modelo({'Type': req.body.time, 'Name': req.body.name, 'Email': req.body.email, 'Phone': req.body.phone, 'Address': req.body.address, 'Lat': req.body.lat, 'Lng': req.body.lng });
  fluffy.save(function (err, fluffy) {
    if (err) return console.error(err);
    fluffy.mess();
    for(var i=0;i<req.body.x;i++)
    {
      var SmellyCat = new ModelI({'id': fluffy._id, 'FieldName': req.files[i].fieldname, 'OName':req.files[i].originalname, 'Mimetype':req.files[i].mimetype, 'Path':req.files[i].path });
      SmellyCat.save();
    }
  });
  console.log(req.body.x);

  return res.redirect('/');

  res.send(req.files);
});
app.post('/hellomoto',function(req,res){
    var x = req.body.id;
    console.log(x);
    Modelo.find({},function (err, docs) {
    if (err) return console.error(err);

     console.log(docs[x]);
     res.send(docs[x]);
    });
});
app.post('/hotel',function(req,res){
  var entry_id = req.body.id;
  console.log(entry_id);
  Modelo.find({},function(err,docs){
    if(err) return console.error(err);
    //console.log(docs[entry_id]._id);
      ModelI.find({'id': docs[entry_id]._id},function(err,data){
        if(err) return console.error(err);
       console.log(data);
       res.send(data); 
      });
     
  });

})
// app.post('/save',function(req,res){	
// 	console.log(req.body.lat);
// 	console.log(req.body.lng);
// 	var fluffy = new Modelo({ 'Type': req.body.time, 'Name': req.body.name, 'Email': req.body.email, 'Phone': req.body.phone, 'Address': req.body.address, 'Lat': req.body.lat, 'Lng': req.body.lng });
// 	fluffy.save(function (err, fluffy) {
// 	  if (err) return console.error(err);
// 	  fluffy.mess();	
// 	});
//     return res.redirect('/');

// });

app.post('/latlng',function(req,res){
    console.log(req.body.current);
    var x = req.body.current;
    Modelo.find({},function (err, docs) {
    if (err) return console.error(err);
    console.log(docs[x].Lat);
    console.log(docs[x].Lng);
    res.send(docs[x]);
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
