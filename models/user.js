var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var Task = require('./task');

var UserSchema = new mongoose.Schema({
    username: {
      type: String,
      unique: true
    },
    email: {
      type: String,
      unique: true
    },
    password: {
      type: String,
      unique: false
    },
    tasks: [ { type: String, unique: true } ]
});


UserSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model("User", UserSchema);
