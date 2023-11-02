const { Router } = require("express");

const authenticator = require('../middleware/authenticator');

const boardController = require("../controllers/boardController");
const columnController = require("../controllers/columnController");
const subtaskController = require("../controllers/subtaskController");
const taskController = require("../controllers/taskController")

const boardRouter = Router();

boardRouter.get("/", boardController.showAllBoards) //show all boards
boardRouter.post("/", boardController.createNewBoard) //creating a new board
boardRouter.get("/user", boardController.showByAuthToken, authenticator) //show all boards for the current user
boardRouter.get("/:boardID", boardController.indexBoards) //show one specific board for the user
boardRouter.patch("/:boardID", boardController.updateBoard)
boardRouter.delete("/:boardID", boardController.destroy)


// Column Routes
boardRouter.get("/:boardID/columns", columnController.showColumns)
boardRouter.post("/:boardID/columns", columnController.createNewColumn)
boardRouter.get("/:boardID/columns/:columnID", columnController.indexColumns)
boardRouter.patch("/:boardID/columns/:columnID", columnController.updateColumn)
boardRouter.delete("/:boardID/columns/:columnID", columnController.destroy)


// Task Routes
boardRouter.get("/:boardID/columns/:columnID/tasks", taskController.showTasks)
boardRouter.post("/:boardID/columns/:columnID/tasks", taskController.createNewTask)
boardRouter.get("/:boardID/columns/:columnID/tasks/:taskID", taskController.indexTasks)
boardRouter.patch("/:boardID/columns/:columnID/tasks/:taskID", taskController.updateTasks)
boardRouter.delete("/:boardID/columns/:columnID/tasks/:taskID", taskController.destroy)


// Subtask Routes
boardRouter.get("/:boardID/columns/:columnID/tasks/:taskID/subtasks", subtaskController.showSubtasks)
boardRouter.post("/:boardID/columns/:columnID/tasks/:taskID/subtasks", subtaskController.createNewSubtask)
boardRouter.get("/:boardID/columns/:columnID/tasks/:taskID/subtasks/:subtaskID", subtaskController.indexSubtasks)
boardRouter.patch("/:boardID/columns/:columnID/tasks/:taskID/subtasks/:subtaskID", subtaskController.updateSubtask)
boardRouter.delete("/:boardID/columns/:columnID/tasks/:taskID/subtasks/:subtaskID", subtaskController.destroy)




module.exports = boardRouter;
