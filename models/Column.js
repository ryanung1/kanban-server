const db = require("../database/connect");
const User = require("./User")

class Column {
  constructor({ column_id, column_name, board_id }) {
    this.column_id = column_id;
    this.column_name = column_name;
    this.board_id = board_id;
  }

  static async getAllColumns(board_id) {
    const response = await db.query("SELECT * FROM columns WHERE board_id = $1", [board_id]);
    return response.rows.map((g) => new Column(g));
  }

  static async index(id) {
    const response = await db.query("SELECT * FROM columns where column_id = $1", [id]);
    if(response.rows.length != 1) {
        throw new Error("Unable to locate board")
    }
    return response.rows.map(b => new Column(b))
  }

  static async createColumn(data) {
    const column_name = data.column_name
    const board_id = data.board_id
    let response = await db.query("INSERT INTO columns (column_name, board_id) VALUES ($1, $2) RETURNING column_id", [column_name, board_id]);
    const newId = response.rows[0].column_id;
    const newColumn = await Column.index(newId)
    return newColumn
  }

  async update(data) {
    const newColumnName = data.column_name;
    this.column_name = newColumnName
    const columnNameResponse = await db.query("UPDATE columns SET column_name = $1 WHERE column_id = $2", [newColumnName, this.column_id]);
    return
  }

  async destroy(id) {
    let response = await db.query("DELETE FROM columns WHERE column_id = $1", [id]);
}

}

module.exports = Column;