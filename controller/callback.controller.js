var { Task,validateTask } = require('../models/task.model');

module.exports.ShopCallback = async (req,res) => {
    const {error} = validateTask(req.body);
    if(error){
        return res.status(400).send({message:'invalid task',error:error.details[0].message});
    }

    try {
        const task = new Task(req.body);
       await task.save();
       return res.status(200).send({message:"save task successfully"});
    } catch (error) {
        console.error(error);
        return res.status(500).send({message:"save task failed",error:error.message});
    }

}