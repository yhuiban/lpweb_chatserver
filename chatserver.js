let express = require('express');
let session = require('express-session')
let bodyParser = require('body-parser')

// ==================================================================
// global variables
// ==================================================================
let tokenId = 0;
let messageList = [];
let names = [];

// ==================================================================
// express app configuration
// ==================================================================
let app = express();

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
    res.redirect('/');
  } else {
    renderChatPage(req, res);
  }
});

// chat post
app.post('/chat', function(req, res) {
  if (req.body.name) {
    if (names.includes(req.body.name)) {
      // user name is already taken
      res.redirect('/');
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

  // The token should be the same
  if (req.session.userSTP != req.body.userSTP) {
    res.redirect('/');
  }
  // render pages
  if (!isUsernameDefined(req)) {
    res.redirect('/');
  } else {
    renderChatPage(req, res);
  }
});

// chat reset link
app.get('/reset', function (req, res) {
  messageList = [];
  names = [];
  res.redirect('/');
});

// ==================================================================
// utils
// ==================================================================
function isUsernameDefined(req) {
  return req.session.username && req.session.username != '';
}

function renderChatPage(req, res) {
  req.session.userSTP = tokenId++;
  console.log('req.session.userSTP = ' + req.session.userSTP);
  res.render('pages/chat', {name: req.session.username, userSTP: req.session.userSTP, messageList});
}

// ==================================================================
// main
// ==================================================================
app.listen(8083);
console.log('listening on 8083');
