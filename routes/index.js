var express = require('express');
var router = express.Router();

// For passwd hashing
const bcrypt = require('bcrypt');
const saltRounds = 10;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET Hello World page. */
router.get('/helloworld', function(req, res) {
  res.render('helloworld', { title: 'Im gonna say the n word!' });
});

/* GET Userlist page. */
router.get('/userlist', function(req, res) {
  var connection = req.db;
  connection.query('SELECT * FROM usercollection', function(err, rows, fields) {
    console.log(rows)
    res.render('userlist', {
        "userlist" : rows,
    });
  });
});

/* POST to Add User Service */
router.post('/adduser', function(req, res) {

  // Set our internal DB variable
  var connection = req.db;

  // Get our form values. These rely on the "name" attributes
  var userName = req.body.username;
  var userEmail = req.body.useremail;
  var password = req.body.password;
  let hashedPW = '';
  bcrypt.hash(password, saltRounds, (err, hashed) => {
    if (err) {
      throw err;
    }
    hashedPW = hashed;
  })
  console.log(password);
  console.log(hashedPW);
  // We're not populating ID here because it should be auto-incrementing
  var newUser = { username: userName, email: userEmail, password: hashedPW}

  // Submit to the DB
  connection.query('INSERT INTO usercollection SET ?', newUser, function (error, results, fields) {
      if (error) {
          // If it failed, return error
          res.send("There was a problem adding the information to the database.");
      }
      else {
          // If it worked, set the header so the address bar doesn't still say /adduser
          //res.location("userlist");
          // And forward to success page
          res.redirect("userlist");
      }
  });
});

module.exports = router;
