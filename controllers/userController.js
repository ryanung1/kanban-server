const bcrypt = require("bcrypt");
const User = require("../models/User");
const Token = require("../models/Token");

async function register (req, res) {
    
    try {
        const data = req.body;
        const salt = await bcrypt.genSalt(parseInt(process.env.BCYPT_SALT_ROUNDS)); 
        
        data["password"] = await bcrypt.hash(data["password"], salt);
        const result = await User.createNewUser(data);
        console.log('data', data, "salt", salt)
        res.status(201).send(result);

    } catch (err) {
        console.log("error")
        res.status(400).json({"error": err.message});
    }
};

async function show (req, res) {

    try {
        const id = parseInt(req.params.id);
        const user = await User.getOneById(id);
        delete user['password'];
        res.send(user);
    } catch (err) {
        res.status(404).json({"error": err.message});
    }
}

async function login (req, res) {
    
    try {
        // const username = req.body["email-address"]
        const user = await User.getOneByUsername(req.body.username);
        const authenticated = await bcrypt.compare(req.body.password, user["password"]);


        if (!authenticated) {

            throw new Error("Incorrect credentials");
        } else {
            
            const token = await Token.create(user["id"]);
            console.log("token:", token);

            res.cookie("kanbanUser", token.token, {maxAge: 36000000, sameSite: "none", secure: true});
            res.cookie("userId", user["id"], {maxAge: 36000000, sameSite: 'none', secure: true});

            res.status(200).json({ authenticated: true, token: token.token, userID: user["id"] })
        }

    } catch (err) {
        
        res.status(403).json({"error": err.message})
    }
}

async function logout (req, res) {

    res.clearCookie("norseUser", {
        sameSite: "none",
        secure: true,
    });

    res.clearCookie("userId", {
        sameSite: "none",
        secure: true,
    });

    res.status(204).send();
}

module.exports = { register, show, login, logout };