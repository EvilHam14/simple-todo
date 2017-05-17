const express     = require('express');
const bodyParser  = require('body-parser');
const path        = require('path');
const passport    = require('passport');
const LocalStrategy   = require("passport-local");
const User        = require('./models/user');
const mongoose    = require('mongoose');
const config      = require('./config/database');
const methodOverride  = require('method-override');
const flash       = require('connect-flash');
const app         = express();

// Port
const port        = 3000;

// Connecting Database
mongoose.connect(config.database);
mongoose.connection.on('connected', () => {
  console.log('Connected to database ' + config.database);
});
// Database Error Handle
mongoose.connection.on('error', (err) => {
  console.log('Database error: ' + err);
});



// Passport Config
app.use(require("express-session")({
    secret: "833km!klwwvw3a0Sj3",
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session({ secret: "833km!klwwvw3a0Sj3"}));
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    if(err) { return done(err); }
    done(null, user);
  });
});
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// Flash Message
app.use(flash());
// experimental ################ should make flash messages work in all routes
app.use(function(req, res, next){
    res.locals.success_messages = req.flash('success_messages');
    res.locals.error_messages = req.flash('error_messages');
    next();
});
// experimental ################

app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + '/views'));
app.set('view engine', 'html');
app.use(methodOverride("_method"));

// Required Routes
const indexRoutes = require('./routes/index');
const userRoutes = require('./routes/user');
const apiRoutes = require('./routes/api');



// app.set("view engine", "html");

// Body-Parser
app.use(bodyParser.urlencoded({ extended: false }));

// Root Route
app.get("/", function(req, res){
  res.sendFile("index");
});

app.use(indexRoutes);
app.use("/user", userRoutes);
app.use("/api", apiRoutes);

app.get("*", function(req, res){
  res.send("Are you lost???");
});



app.listen(port, function(){
  console.log("Server started on port: " + port);
});
