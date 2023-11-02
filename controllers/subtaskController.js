const Subtask = require("../models/Subtask")
const User = require("../models/User")



async function activeUser(req, res) {
    try {
        const tokenValue = req.cookies.kanbanUser
        console.log("tokenValue", tokenValue)
        const user = await User.searchByToken(tokenValue)
        console.log(user)
        return user
    } catch(err) {
        res.status(500).json({"error": err.message})
    }
}

async function showSubtasks (req, res) {
    try {
        const user = await activeUser(req, res)
        const task_id = req.params.taskID
        const subtasks = await Subtask.getAllSubtasks(task_id)
        res.json(subtasks)
    } catch(err) {
        res.status(500).json({ "error": err.message })
    }
}

async function createNewSubtask (req, res) {
    try {
        const data = req.body;
        const user = await activeUser(req, res)
        const task_id = req.params.taskID
        data["task_id"] = task_id
        const newSubtask = await Subtask.createSubtask(data)
        console.log(newSubtask)
        res.status(201).json(newSubtask)
    } catch(err) {
        res.status(500).json({ "This is an error": err.message })
    }
}

async function indexSubtasks (req, res) {
    try {
        const user = await activeUser(req, res)
        const subtask_id = req.params.subtaskID
        const subtask = await Subtask.index(subtask_id)
        res.json(subtask)
    } catch(err) {
        res.status(500).json({ "error": err.message })
    }
}

async function updateSubtask (req, res) {
    try {
        const subtask_id = parseInt(req.params.taskID)
        const subtask = await Subtask.index(subtask_id)
        await subtask[0].update(req.body)
        res.status(201).json(subtask[0])
    } catch(err) {
        res.status(500).json({ "error": err.message})
    }
}

async function destroy (req,res) {
    try {
        const id = parseInt(req.params.subtaskID);
        const subtask = await Subtask.index(id);
        await subtask[0].destroy(id);
        res.json(subtask);
    } catch (err) {
        res.status(404).json({"error": err.message});
    }
}

module.exports = {
    showSubtasks,
    createNewSubtask,
    indexSubtasks,
    updateSubtask,
    destroy
}