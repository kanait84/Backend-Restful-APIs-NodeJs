var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

// Using Node.js `require()`
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/users', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

var db = mongoose.connection;

// handle mongo error
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function () {
  console.log('Database Connected');
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const testjwt = jwt.sign({
  exp: Math.floor(Date.now() / 1000) + (60 * 60),
  data: 'foobar'
}, 'secret');

console.log('testjwt', testjwt);

jwt.verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MTg0ODIwNTEsImRhdGEiOiJmb29iYXIiLCJpYXQiOjE2MTg0Nzg0NTF9.4A0UoKpcEuOOb17IkVa-JsLL6dqw5u8xMeYO5s99U-U', 'secret', function(err, decoded) {
  console.log(decoded);
});


module.exports = router;
