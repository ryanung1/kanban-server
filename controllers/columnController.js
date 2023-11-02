const Column = require("../models/Column");
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

async function showColumns (req, res) {
    try {
        const user = await activeUser(req, res)
        const board_id = req.params.boardID
        const board = await Column.getAllColumns(board_id)
        res.json(board)
    } catch(err) {
        res.status(500).json({ "error": err.message })
    }
}

async function createNewColumn (req, res) {
    try {
        const data = req.body;
        const user = await activeUser(req, res)
        const board_id = req.params.boardID
        data["board_id"] = board_id
        const newColumn = await Column.createColumn(data)
        console.log(newColumn)
        res.status(201).json(newColumn)
    } catch(err) {
        res.status(500).json({ "error": err.message })
    }
}

async function indexColumns (req, res) {
    try {
        const user = await activeUser(req, res)
        const column_id = req.params.columnID
        const column = await Column.index(column_id)
        res.json(column)
    } catch(err) {
        res.status(500).json({ "error": err.message })
    }
}

async function updateColumn (req, res) {
    try {
        const column_id = parseInt(req.params.columnID)
        const column = await Column.index(column_id)
        await column[0].update(req.body)
        res.status(201).json(column[0])
    } catch(err) {
        res.status(500).json({ "error": err.message})
    }
}

async function destroy (req,res) {
    try {
        const id = parseInt(req.params.columnID);
        const column = await Column.index(id);
        await column[0].destroy(id);
        res.json(column);
    } catch (err) {
        res.status(404).json({"error": err.message});
    }
}

module.exports = {
    
    showColumns,
    createNewColumn,
    indexColumns,
    updateColumn,
    destroy
    
}