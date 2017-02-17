var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',function(){
	console.log("Yo yo yo");
});
var EventSchema = mongoose.Schema ({
		Type: String,
    	Name: String,
    	Email: String,
    	Phone: String,
    	Address: String,
    	Lat: String,
    	Lng: String
});
var Modelo = mongoose.model('hello', EventSchema,'oyo');
	

router.get('/', function(req, res, next) {
 		//console.log('yo people ');
	Modelo.find({},function (err, docs) {
	  if (err) return console.error(err);
	  res.render('view', { docs: docs });
	});
});

module.exports = router;
