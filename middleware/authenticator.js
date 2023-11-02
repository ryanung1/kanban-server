
const Token = require("../models/Token");

function authenticator(req, res, next) {

    // console.log(req.cookies)
    // const userCookie = req.cookies.ClueDev;
    // console.log("this is at auth: ", userCookie)

    try {
        const cookie = req.cookies.kanbanUser

        console.log(req.headers)
        console.log("userToken:", userToken);
        if (!cookie) {
            throw new Error("User not authenticated")
        } else {
            const validToken = Token.getOneByToken(cookie);
            next()
        }

    } catch (err) {
        res.status(403).json({"error" : err.message});
    }
}

module.exports = authenticator;