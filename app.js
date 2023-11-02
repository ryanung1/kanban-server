const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const userRouter = require('./routers/userRouter');
const boardRouter = require("./routers/boardRouter")

const app = express();
app.use(express.json());
app.use(cors({ origin: "https://gleaming-dango-c3afd3.netlify.app/", credentials: true}));
app.use(cookieParser());
// app.use(cors({ origin: "http://localhost:5173", credentials: true}));
https://gleaming-dango-c3afd3.netlify.app/
app.use(express.json());



app.get('/', (req, res) => {
    res.send("Kanban API")
})

app.use("/users", userRouter);
app.use("/boards", boardRouter);

module.exports = app