const db = require("../database/connect");

const Board = require("./Board");

class BoardWithColumns extends Board {
    constructor({ board_id, board_name, user_id, columns }) {
        super({ board_id, board_name, user_id });
        this.columns = columns;
    }

    static async getAllBoardsWithColumns(user_id) {
        const response = await db.query("SELECT * FROM boards WHERE user_id = $1", [user_id]);
        const userBoards = response.rows;

        for(let i = 0; i < userBoards.length; i++) {
            const columnResponse = await db.query("SELECT column_id, column_name FROM columns WHERE board_id = $1", [userBoards[i]["board_id"]]);
            const columns = columnResponse.rows;

            for(let j = 0; j < columns.length; j++) {
                const columnsTasksResponse = await db.query("SELECT * FROM tasks WHERE column_id = $1", [columns[j]["column_id"]]);
                const columnsTasks = columnsTasksResponse.rows;
                columns[j]["tasks"] = columnsTasks

                for(let k = 0; k < columnsTasks.length; k++) {
                    const tasksSubtasksResponse = await db.query("SELECT * FROM subtasks WHERE task_id = $1", [columnsTasks[k]["task_id"]])
                    const tasksSubtasks = tasksSubtasksResponse.rows;
                    columnsTasks[k]["subtasks"] = tasksSubtasks
                }
            }

            userBoards[i]["columns"] = columns;
        }

        console.log(userBoards)

        return userBoards.map((b) => new BoardWithColumns(b))
    }
}

module.exports = BoardWithColumns;
