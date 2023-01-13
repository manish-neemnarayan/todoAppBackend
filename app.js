// first thing to config our env file
require("dotenv").config();
// mongo connection
const dbconnect = require('./config/db');

const express = require("express");
const authRouter = require("./routes/todosRouter"); // auth router middleware
const cookieParser = require("cookie-parser");

// creating app
const app = express();
app.get("/", (req, res) => {
    res.send("hey you doing fine///");
})

dbconnect.connect(); //database connection
// middleware use
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use(authRouter);

// exporting
module.exports = app;


