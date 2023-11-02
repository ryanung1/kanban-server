const db = require("../database/connect");
const User = require("./User")

class Task {
  constructor({ task_id, task_name, task_description, column_id, completed }) {
    this.task_id = task_id;
    this.task_name = task_name;
    this.task_description = task_description;
    this.column_id = column_id;
    this.completed = completed;
  }

  static async getAllTasks(column_id) {
    const response = await db.query("SELECT * FROM tasks WHERE column_id = $1", [column_id]);
    console.log(response.rows)
    // if(!response.rows.length) {
    //     throw new Error("Unable to locate tasks")
    // }
    return response.rows.map((g) => new Task(g));
  }

  static async index(id) {
    const response = await db.query("SELECT * FROM tasks where task_id = $1", [id]);
    if(response.rows.length != 1) {
        throw new Error("Unable to locate board")
    }
    return response.rows.map(b => new Task(b))
  }

  static async createTask(data) {
    const {task_name, column_id, task_description, completed } = data
    let response = await db.query("INSERT INTO tasks (task_name, column_id, task_description, completed) VALUES ($1, $2, $3, $4) RETURNING task_id", [task_name, column_id, task_description, completed]);
    const newId = response.rows[0].task_id;
    const newTask = await Task.index(newId)
    return newTask
  }

  async update(data) {
    const { column_id, task_name, task_description, completed } = data
    console.log("THIS", this.column_id)
    console.log("NEW", column_id)
    this.column_id = column_id
    this.task_name = task_name
    this.task_description = task_description
    this.completed = completed
    const taskResponse = await db.query("UPDATE tasks SET column_id = $1, task_name = $2, task_description = $3, completed = $4 WHERE task_id = $5", [column_id, task_name, task_description, completed, this.task_id]);
    return
  }

  async destroy(id) {
    let response = await db.query("DELETE FROM tasks WHERE task_id = $1", [id]);
  }

}

module.exports = Task;