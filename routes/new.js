var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('new', { title: 'Register' });
});

module.exports = router;
