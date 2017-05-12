const express     = require('express');
const bodyParser  = require('body-parser');
const router      = express.Router();
const middleware  = require('./../middleware/index');
const User        = require('./../models/user');
const Task        = require('./../models/task');


// Read
router.get("/", middleware.isLoggedIn, function(req, res){
  User.findById(req.session.passport.user, function(err, user){

    if(err){
      console.log(err);
      res.redirect("/login");

    } else {

        Task.find( { _id: { $in: user.tasks }}, function(err, tasks){
          if(err){
            console.log(err);
          }
          if(!tasks){
            console.log("Couldn't find the task");
          } else {
            console.log("found tasks: " + tasks);
            res.render("app-mobile", {user: user, tasks: tasks});
          }
        });
      }
  });
});

// Create
router.post("/task", function(req, res){

  // Make a New Task and fill
  // with user info
  var newTask = new Task({username:req.session.passport.user, taskName: req.body.task, day: req.body.day, isDone: false});
  // console.log(newTask);
  // Create the new task for Mongo

  newTask.save(function(err){
    if(err){
      console.log(err);
    } else {
      console.log("I just created a new task!");
    }
  });

      //Pass the new task id to the user.tasks[] array
      User.findByIdAndUpdate(req.session.passport.user, { $push: {tasks: newTask._id} }, function(err){
        if(err){
          console.log(err);
        }
        else{
          console.log("updated the task into the user!");
        }
      });


  res.redirect("/user");
});

// Update
router.put("/task", function(req,res){
  var userId = req.session.passport.user;
  var taskId = req.body._id;
  var taskState = req.body.isDone;
  // Comparing string "true" || "false" to
  // Boolean value
  var finalState = false;
  if( taskState.localeCompare("true") == 0 ){
    finalState = true;
  } else {
    finalState = false;
  }

  Task.findByIdAndUpdate(taskId, {isDone: finalState}, function(err, task){
    if(err){
      console.log(err);
    }
    if(!task){
      console.log("Task not found!");
    } else {
      console.log("Task: " + task.taskName + " is now updated updated to: " + finalState );
    }
    res.redirect("/user");
  });

});

// Delete
router.delete("/task", function(req, res){
  var userId = req.session.passport.user;
  var taskId = req.body._id;
  Task.findByIdAndRemove(taskId, function(err, task){
    if(err){
      console.log(err);
    }
    if(!task){
      console.log("Task not found!");
    } else {
      User.findByIdAndUpdate(userId, { $pull: { tasks: { $in: [ taskId ]} } }, function(err, user){
        if(err){
          console.log(err);
        }
        if(!user){
          console.log("can't find the user!");
        } else {
          console.log("Task is removed");
        }
      });
    }
    res.redirect("/user");
  });
});

module.exports = router;
