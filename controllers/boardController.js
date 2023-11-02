const Board = require("../models/Board");
const Column = require("../models/Column");
const Task = require("../models/Task")
const User = require("../models/User")
const Subtask = require("../models/Subtask")
const BoardWithColumns = require("../models/BoardWithColumns")


async function activeUser(req, res) {
    try {
        const tokenValue = req.cookies.kanbanUser
        console.log("tokenValue", tokenValue)
        const user = await User.searchByToken(tokenValue)
        // console.log(user)
        return user
    } catch(err) {
        res.status(500).json({"error": err.message})
    }
}

async function showAllBoards(req, res) {
    try {
      const boards = await Board.getAllBoards();
      console.log(boards)
      res.json(boards);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
}

async function createNewBoard(req, res) {
    try {
        const data = req.body;
        console.log(data)
        const token = req.cookies.kanbanUser
        console.log(token)
        const user = await User.searchByToken(token)
        console.log(user.id)
        data["user_id"] = user.id
        const newBoard = await Board.createBoard(data)
        console.log(newBoard)
        res.status(201).json(newBoard)
    } catch(err) {
        res.status(500).json({ "error": err.message })
    }
}

async function showByAuthToken(req, res) {
    try {
        const user = await activeUser(req, res)
        const boards = await BoardWithColumns.getAllBoardsWithColumns(user.id)
        res.json(boards)
    } catch(err) {
        res.status(500).json({"error": err.message})
    }
}

async function indexBoards (req, res) {
    try {
        const user = await activeUser(req, res)
        const board_id = req.params.boardID
        console.log(board_id)
        const board = await Board.index(board_id)
        res.json(board)
    } catch(err) {
        res.status(500).json({ "error": err.message })
    }
}

async function updateBoard (req, res) {
    try {
        const board_id = parseInt(req.params.boardID)
        const board = await Board.index(board_id)
        await board[0].update(req.body)
        res.status(201).json(board[0])
    } catch(err) {
        res.status(500).json({ "error": err.message})
    }
}

async function destroy (req,res) {
    try {
        const id = parseInt(req.params.boardID);
        const board = await Board.index(id);
        await board[0].destroy(id);
        res.json(board);
    } catch (err) {
        res.status(404).json({"error": err.message});
    }
}




module.exports = {
    showAllBoards,
    createNewBoard,
    showByAuthToken,
    indexBoards,
    updateBoard,
    destroy

}
  
