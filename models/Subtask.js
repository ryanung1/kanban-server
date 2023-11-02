const db = require("../database/connect");
const User = require("./User")

class Subtask {
  constructor({ subtask_id, subtask_name, subtask_description, task_id, completed }) {
    this.subtask_id = subtask_id;
    this.subtask_name = subtask_name;
    this.subtask_description = subtask_description;
    this.task_id = task_id;
    this.completed = completed;
  }

  static async getAllSubtasks(task_id) {
    const response = await db.query("SELECT * FROM subtasks WHERE task_id = $1", [task_id]);
    console.log(response.rows)
    // if(!response.rows.length) {
    //     throw new Error("Unable to locate tasks")
    // }
    return response.rows.map((g) => new Subtask(g));
  }

  static async index(id) {
    const response = await db.query("SELECT * FROM subtasks where subtask_id = $1", [id]);
    if(response.rows.length != 1) {
        throw new Error("Unable to locate board")
    }
    return response.rows.map(b => new Subtask(b))
  }

  static async createSubtask(data) {
    const {subtask_name, task_id, subtask_description, completed } = data
    let response = await db.query("INSERT INTO subtasks (subtask_name, task_id, subtask_description, completed) VALUES ($1, $2, $3, $4) RETURNING subtask_id", [subtask_name, task_id, subtask_description, completed]);
    const newId = response.rows[0].subtask_id;
    const newSubtask = await Subtask.index(newId)
    return newSubtask
  }

  async update(data) {
    const {subtask_name, subtask_description, completed } = data
    this.subtask_name = subtask_name
    this.subtask_description = subtask_description
    this.completed = completed
    const subtaskResponse = await db.query("UPDATE subtasks SET subtask_name = $1, subtask_description = $2, completed = $3 WHERE subtask_id = $4", [subtask_name, subtask_description, completed, this.subtask_id]);
    return
  }

  async destroy(id) {
    let response = await db.query("DELETE FROM subtasks WHERE subtasks_id = $1", [id]);
  }

}

module.exports = Subtask;