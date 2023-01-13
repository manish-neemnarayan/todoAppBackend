const express = require("express");

// importing controllers for routes
const { authRegister, authLogin, createTodo, updateTodo, getAllTodos, searchTodo } = require("../controllers/authUserController");
/**
 * 1. Auth Router will consist register and login
 * 2. Todos Router(Tasks)
 */
 const Router = express.Router();
 const todoRouter = express.Router();

// auth router for register
Router.post("/auth/register", authRegister);
// auth router for login
Router.post("/auth/login", authLogin);

// todo create router
Router.post("/api/createTodo/:userId", createTodo);
// todo update router
Router.put("/api/updateTodo/:todoId", updateTodo);
// get all todos of a particular user
Router.get("/api/todos/:userId", getAllTodos);
// search todo
Router.get("/api/searchtodo/:userId", searchTodo);


// export router 
module.exports = Router;