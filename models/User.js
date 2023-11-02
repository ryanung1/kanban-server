const db = require("../database/connect");
const Token = require("./Token")

class User {
    constructor({ user_id, username, user_password, is_admin }) {
        this.id = user_id;
        this.username = username;
        this.password = user_password;
        this.isAdmin = is_admin;
    }

    static async getOneById(id) {
        console.log(id)
        const response = await db.query("SELECT * FROM user_account WHERE user_id = $1", [id]);
        if (response.rows.length != 1) {
            throw new Error ("Unable to locate user");
        } else {
            return new User (response.rows[0])
        }
    }

    static async getOneByUsername(username) {
        const response = await db.query("SELECT * FROM user_account WHERE username = $1", [username]);
        if (response.rows.length != 1) {
            throw new Error ("Unable to locate user");
        } else {
            return new User (response.rows[0]);
        }
    }

    static async searchUser(searchTerm) {
        let response = null
        if (/^\d+$/.test(searchTerm)) {
            response = await db.query("SELECT * FROM user_account WHERE user_id = $1", [parseInt(searchTerm)]);
        } else {
            response = await db.query("SELECT * FROM user_account WHERE username = $1", [searchTerm]);
        }

        if (response.rows.length != 1) {
            throw new Error("Unable to locate user.")
        }
        return new User(response.rows[0]);  
    }

    static async createNewUser(data) {
        const { username, password } = data;
        let response = await db.query("INSERT INTO user_account (username, user_password) VALUES ($1, $2) RETURNING user_id", [username, password]);
        const newId = response.rows[0].user_id;
        const newUser = await User.getOneById(newId);
        return newUser
    }

    static async searchByToken(tokenValue) {
        const token = await Token.getOneByToken(tokenValue)

        const userId = token.user_id
        
        const response = await db.query("SELECT * FROM user_account WHERE user_id = $1", [userId]);

        if (response.rows.length != 1) {
            throw new Error("Unable to locate user.")
        }
        return new User(response.rows[0]);
    }
}

module.exports = User;