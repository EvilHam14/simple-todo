var mongoose = require("mongoose");

var daySchema = mongoose.Schema({
    day: String,
    date: Number,
    month: String,
    year: Number,
    task: {
      taskName: String,
      isDone: Boolean
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Day", daySchema);
