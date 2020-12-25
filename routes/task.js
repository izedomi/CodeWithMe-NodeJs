const express = require('express');
const router = express.Router();
const TaskModel = require('../models/task_model');

router.get('/createTask', async(req, res, next) => {
    
    try{
        
        let task = new TaskModel();
        await task.save();

        res.redirect(`task/${task._id}`);
    }
    catch(e){
        console.log(e)
    }
});

router.get('/task/:id', (req, res, next) => {

    if(req.params.id){
        const task_id = req.params.id;
        res.render('task', {title: "task", data: task_id})
    }
   
});

module.exports = router;