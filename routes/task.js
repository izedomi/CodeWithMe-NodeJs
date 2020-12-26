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

router.get('/task/:id', async(req, res, next) => {

    if(req.params.id){
        try{
            const task_id = req.params.id;
            var task = await TaskModel.findById(task_id);
            if(task) 
                return res.render('task', {title: "task", data: task_id, content: task.content})

            return res.render('error');
        }
        catch(e){
            return res.render('error');
        }
       
    }

    return res.render('error');
   
});

module.exports = router;