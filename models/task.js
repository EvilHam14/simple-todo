var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var TaskSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: false
  },
  taskName: {
    type: String,
    unique: false
  },
  day: {
    type: Number,
    unique: false
  },
  isDone: {
    type: Boolean,
    unique: false
  }
});

TaskSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Task", TaskSchema);



// module.exports = mongoose.model("Task", TaskSchema);
