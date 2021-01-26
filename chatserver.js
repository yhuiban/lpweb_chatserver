var express = require('express');
var session = require('express-session')
var bodyParser = require('body-parser')

// ==================================================================
// express app configuration
// ==================================================================
var app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: 'my session secret',
  resave: false,
  saveUninitialized: true,
  cookie: {}
}))

// set the view engine to ejs
app.set('view engine', 'ejs');

// ==================================================================
// index page
// ==================================================================
app.get('/', function(req, res) {
  if (isUsernameDefined(req)) {
    names = names.filter(function (item) {return item == req.session.username});
  }
  req.session.username = "";
  res.render('pages/index');
});

// ==================================================================
// chat page
// ==================================================================
// chat get
app.get('/chat', function(req, res) {
  if (!isUsernameDefined(req)) {
    res.redirect('/chat_server/');
  } else {
    res.render('pages/chat', {name: req.session.username, messageList});
  }
});

// chat post
app.post('/chat', function(req, res) {
  if (req.body.name) {
    if (names.includes(req.body.name)) {
      // user name is already taken
      res.redirect('/chat_server/');
      return;
    } else {
      // user is unknown, create a session
      req.session.username = req.body.name;
      names.push(req.body.name);
      console.log("join: " + req.session.username);
    }
  }
  // we should never have message and name in the same post
  if (isUsernameDefined(req) && req.body.message && !req.body.name) {
    messageList.push(req.session.username + ': ' + req.body.message);
    console.log("message: " + req.session.username);
  }
  // render pages
  if (!isUsernameDefined(req)) {
    res.redirect('/chat_server/');
  } else {
    res.render('pages/chat', {name: req.session.username, messageList});
  }
});

// chat reset link
app.get('/reset', function (req, res) {
  messageList = [];
  names = [];
  res.redirect('/chat_server/');
});

// ==================================================================
// utils
// ==================================================================
function isUsernameDefined(req) {
  return req.session.username && req.session.username != '';
}

// ==================================================================
// main
// ==================================================================
app.listen(8083);
console.log('listening on 8083');
let messageList = [];
let names = [];
