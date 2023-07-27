var express = require('express');
var router = express.Router();
const passport = require('passport');


router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/auth/google', passport.authenticate(
  'google',
  {
    scope: ['profile', 'email'],
  }
));

router.get('/oauth2callback', passport.authenticate(
  'google',
  {
    successRedirect: '/coffee',
    failureRedirect: '/coffee'
  }
));

router.get('/logout', function(req, res){
  req.logout(function() {
    res.redirect('/coffee');
  });
});



module.exports = router;
