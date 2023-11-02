const Task = require("../models/Task")
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

async function showTasks (req, res) {
    try {
        const user = await activeUser(req, res)
        const column_id = req.params.columnID
        const tasks = await Task.getAllTasks(column_id)
        res.json(tasks)
    } catch(err) {
        res.status(500).json({ "error": err.message })
    }
}

async function createNewTask (req, res) {
    try {
        const data = req.body;
        const user = await activeUser(req, res)
        const column_id = req.params.columnID
        data["column_id"] = column_id
        const newTask = await Task.createTask(data)
        console.log(newTask)
        res.status(201).json(newTask)
    } catch(err) {
        res.status(500).json({ "This is an error": err.message })
    }
}

async function indexTasks (req, res) {
    try {
        const user = await activeUser(req, res)
        const task_id = req.params.taskID
        console.log(task_id)
        const task = await Task.index(task_id)
        res.json(task)
    } catch(err) {
        res.status(500).json({ "error": err.message })
    }
}

async function updateTasks (req, res) {
    try {
        const task_id = parseInt(req.params.taskID)
        const task = await Task.index(task_id)
        await task[0].update(req.body)
        res.status(201).json(task[0])
    } catch(err) {
        res.status(500).json({ "error": err.message})
    }
}

async function destroy (req,res) {
    try {
        const id = parseInt(req.params.taskID);
        const task = await Task.index(id);
        await task[0].destroy(id);
        res.json(task);
    } catch (err) {
        res.status(404).json({"error": err.message});
    }
}

module.exports = {
    showTasks,
    createNewTask,
    indexTasks,
    updateTasks,
    destroy
}