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

// *****************************************
//             Query String
//
// n   =   newTask   String    task description
//
// da  =   day       Number    day task was created
//
// do  =   isDone    Boolean   check done state


router.get("/", function(req, res){
  res.json({msg: "Welcome to API Index Route!"});
});

router.post("/", function(req, res){
  var n = req.query.n;
  res.json({msg: "POST API Index Route!" + n});
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

  //Casting String to Boolean
  var isTrue = (req.query.do == 'true');

  console.log(typeof isTrue);

  var newTask = new Task({username:userId, taskName: req.query.n, day: req.query.da, isDone: isTrue});

  newTask.save(function(err){
    if(err){
      res.json({errorMsg: err});
    } else {

      User.findByIdAndUpdate(userId, { $push: {tasks: newTask._id} }, function(err){
        if(err){
          res.json({errorMsg: err});
        }
        else{
          res.json({msg: "task added to user"});
        }
      });

    }
  });

});

// UPDATES THE TASK
router.put("/:userId/tasks/:id", function(req, res){
  var userId = req.params.userId;
  var taskId = req.params.id;

  var isTrue = (req.query.do == 'true');

  Task.findByIdAndUpdate(taskId, {isDone: isTrue}, function(err, task){
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
