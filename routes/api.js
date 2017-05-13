const express     = require('express');
const router      = express.Router();
const User        = require('./../models/user');
const Task        = require('./../models/task');

// *****************************************
//             Restful Routes
//
// GET     :userId/tasks        All tasks
//
// POST    :userId/tasks        Adds a new task
//
// PUT     :userId/tasks/:id    Updates task with specific id
//
// DELETE  :userId/tasks/:id    Deletes task with specific id

router.get("/", function(req, res){
  res.json("im at index route");
});

// GET TASKS FROM USER
router.get("/:userId/tasks", function(req, res){
  var userId = req.params.userId;

  Task.find( {username: userId}, function(err, tasks){
    if(err){
      res.json({errorMsg: err});
    }
    if(!tasks){
      res.json({msg: "tasks not found"});
    } else {
      res.json(tasks);
    }
  });

});

// CREATES NEW TASK
router.post("/:userId/tasks", function(req, res){
  var userId = req.params.userId;

  var newTask = new Task({username:req.session.passport.user, taskName: req.body.task, day: req.body.day, isDone: false});

  newTask.save(function(err){
    if(err){
      res.json({errorMsg: err});
    } else {
      res.json({msg: "task successfully created"});
    }
  });

  User.findByIdAndUpdate(userId, { $push: {tasks: newTask._id} }, function(err){
    if(err){
      res.json({errorMsg: err});
    }
    else{
      res.json({msg: "task added to user"});
    }
  });

});

// UPDATES THE TASK
rotuer.put("/:userId/tasks/:id", function(req, res){
  var userId = req.params.userId;
  var taskId = req.params.id;

  // Updated data
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
      res.json({errorMsg: err});
    }
    if(!task){
      res.json({msg: "task not found"});
    } else {
      res.json({msg: "task successfully updated"});
    }
  });

});

// Delete
router.delete("/:userId/tasks/:id", function(req, res){
  var userId = req.params.userId;
  var taskId = req.params.id;

  Task.findByIdAndRemove(taskId, function(err, task){
    if(err){
      res.json({errorMsg: err});
    }
    if(!task){
      res.json({msg: "task not found"});
    } else {
      User.findByIdAndUpdate(userId, { $pull: { tasks: { $in: [ taskId ]} } }, function(err, user){
        if(err){
          res.json({errorMsg: err});
        }
        if(!user){
          res.json({msg: "user not found"});
        } else {
          res.json({msg: "task successfully deleted"});
        }
      });
    }

  });
});


module.exports = router;
