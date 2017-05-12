const express     = require('express');
const bodyParser  = require('body-parser');
const router      = express.Router();
const passport    = require("passport");
const isEmail     = require("email-validator");
const password    = require('password-rules');
const User        = require('./../models/user');
// const Day        = require('./../models/user');

// Get login form
router.get("/login", function(req, res){
  res.render("login", { message: req.flash('error') });
});

// Post login info
router.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }),
  function(req, res) {
    res.redirect("/user");
});

// Post to logout
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

router.get("/register", function(req, res){
  res.render("register", { message: req.flash('error') });
});

// Post login info
router.post("/register", function(req, res){
  var newEmail = req.body.email;
  if( isEmail.validate(newEmail) ){
    User.findOne({email:newEmail}, function(err, user){
      if(err){
        console.log(err);
      }
      if(user){
        req.flash('error', "" + newEmail +" is already in use.");
        res.redirect("/register");
      } else {

        var newUsername = req.body.username;
        User.findOne({username:newUsername}, function(err, user){
          if(err){
            console.log(err);
          }
          if(user){ //user exists already
            req.flash('error', "" + newUsername +" is already taken.");
            res.redirect("/register");
          } else { //user doesn't exist
            var newPassword = req.body.password;
            if(password(newPassword)){ //password = true when NOT STRONG PASSWORD
              req.flash('error', password(newPassword).sentence);
              res.redirect("/register");
            } else {
              var newUser = new User({username: newUsername, email: newEmail});
              User.register(newUser, newPassword , function(err, user){
                 if(err){
                     console.log(err);
                     return res.register("register");
                 }
                 passport.authenticate("local")(req, res, function(){
                    res.redirect("/login");
                 });
              });
            }
          }
        });

      }
    });
  } else {
    req.flash('error', "" + newEmail +" is not a correct email.");
    res.redirect("/register");
  }

});


module.exports = router;
