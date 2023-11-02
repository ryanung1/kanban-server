const { Router } = require('express');
const authenticator = require('../middleware/authenticator');

const userController = require('../controllers/userController');
const userRouter = Router();

userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);
userRouter.get("/logout", userController.logout);
userRouter.get("/:id", userController.show);

module.exports = userRouter;