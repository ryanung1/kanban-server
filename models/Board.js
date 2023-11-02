const db = require("../database/connect");
const User = require("./User")
class Board {
  constructor({ board_id, board_name, user_id }) {
    this.board_id = board_id;
    this.board_name = board_name;
    this.user_id = user_id;
  }

  static async getAllBoards() {
    const response = await db.query("SELECT * FROM boards");
    console.log(response)
    // if(response.rows.length != 1) {
    //     throw new Error("Unable to locate boards")
    // }
    return response.rows.map((g) => new Board(g));
  }

  static async showAll(searchTerm) {
    const user = await User.searchUser(searchTerm)
    const response = await db.query("SELECT * FROM boards WHERE user_id = $1", [user.id])
    if(response.rows.length != 1) {
        throw new Error("No boards found for this user")
    }
    return response.rows.map(b => new Board(b))
  }

  static async index(id) {
    const response = await db.query("SELECT * FROM boards where board_id = $1", [id]);
    if(response.rows.length != 1) {
        throw new Error("Unable to locate board")
    }
    console.log("BOARD:", response.rows[0])
    return response.rows.map(b => new Board(b))
  }

  static async createBoard(data) {
    const board_name = data.board_name
    const user_id = data.user_id
    let response = await db.query("INSERT INTO boards (board_name, user_id) VALUES ($1, $2) RETURNING board_id", [board_name, user_id]);
    const newId = response.rows[0].board_id;
    const newBoard = await Board.index(newId)
    return newBoard
  }

  async update(data) {
    const new_board_name = data.board_name;
    this.board_name = new_board_name
    const boardNameResponse = await db.query("UPDATE boards SET board_name = $1 WHERE board_id = $2", [new_board_name, this.board_id]);
    return
  }

  async destroy(id) {
    console.log(id)
    let response = await db.query("DELETE FROM boards WHERE board_id = $1", [id]);
}


}

module.exports = Board;

// SELECT * FROM game INNER JOIN scene ON game.game_id = scene.game_id INNER JOIN item ON scene.scene_id = item.scene_id WHERE game.game_id = 1
