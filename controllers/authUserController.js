// importing model
const {Auth:AuthUser, Todos} = require("../models/todosModel");

// importing bcrypt for hashing password
const bcrypt = require("bcryptjs");
// importing jwt for token creation
const jwt = require("jsonwebtoken");
// importing secret key from env file
const {SECRETKEY} = process.env;

exports.authRegister = async (req, res) => {

    try {
        const {name, email, password} = req.body;
        // check if data is present 
        if(!(name && email && password)) {
            throw new Error("Name, Email and Password are not specified");
        };
    
        // check if user already available
        const userExist = await AuthUser.findOne({email});
        if(userExist) {
            throw new Error("Email is already taken...");
        };
    
        // password encryption
        const encryptPassword = await bcrypt.hash(password, 12);
    
        // create new user
        const authUser = AuthUser.create({
            name,
            email,
            password : encryptPassword
        });

        // token creation
        const token = await jwt.sign({
            id: authUser._id,
            email  
        }, SECRETKEY, {expiresIn:"2h"});
    
        authUser.token = token;
        authUser.password = undefined;
    
        res.status(200).json({
            success: true,
            authUser
        });
    } catch (error) {
        console.log(error);
        console.log("Error in register route");
        res.status(400).json({
            success: false,
            message: error.message
        })
    }

}

exports.authLogin = async (req, res) => {
    try {
        const {email, password} = req.body;
        // check if data is present 
        if(!(email && password)) {
            throw new Error("Email and Password are not specified");
        };
    
        // check if user already available
        const userExist = await AuthUser.findOne({email});
        if(!userExist) {
            throw new Error("You are not registered, try to register first...");
        };
    
        // compare passwords
        const comparePasswords = await bcrypt.compare(password, userExist.password);
    
        if( userExist && comparePasswords) {
            // creating a new token at every login
            const token = jwt.sign({
                id: userExist._id,
                email
            }, SECRETKEY, {expiresIn: "2h"})
    
            userExist.password = undefined;
            userExist.token = token;
    
            const options =  {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true
            }
    
            res.status(200).cookie("token", token, options).json({
                success: true,
                user: userExist,
                token
            })
        }
        else throw new Error("Password is incorrect");

    } catch (error) {
        console.log(error);
        console.log("error in login route");
        res.status(401).json({
            success: false,
            message: error.message
        })
    }

    
}

exports.createTodo = async (req, res) => {
    try {
        const {todoTitle, tasks, updated} = req.body;
        const {userId} = req.params;

        // validate data
        if(!(todoTitle && tasks)) {
            throw new Error("Data is not specified...");
        }
        // create a todo
        const todo = Todos.create({
            userId,
            todoTitle,
            tasks,
            // updated: new Date(updated).toString()
        })
        res.status(200).json({
            success: true,
            todo
        })
    } catch (error) {
        console.log(error);
        console.log("Error in creating todo route");
        res.status(402).json({
            success: false,
            message: error.message
        })
    }
}

exports.updateTodo = async (req, res) => {
    try {
        const {todoTitle, tasks} = req.body;
        // validate if data exist
        if(!(todoTitle || tasks)) {
            throw new Error("Title and tasks are not specified for update");
        }
    
        await Todos.findByIdAndUpdate(req.params.todoId, {todoTitle, tasks});
        res.status(200).json({
            success: true,
            message: "User is updated..",
            
        })
    } catch (error) {
        console.log(error);
        console.log(error.message);
        res.status(400).json({
            success: false,
            message: "Error in update todo route"
        })
    }

}

exports.getAllTodos = async (req, res) => {
    try {

        // clone chain function is used to make query twice in mongo database
        const data = await Todos.find({userId : req.params.userId}, (err, data) => {
            console.log(data);
        }).clone();


        res.json({
            data
        })
       
    } catch (error) {
        console.log(error);
        console.log(error.message);
        res.status(400).json({
            success: false,
            message: "Error in get todos route"
        })
    }
}

exports.searchTodo = async (req, res) => {
    try {
        // const data = await Todos.find({userId : req.params.userId}).clone();
        const todos = await Todos.find({
            todoTitle: req.body.todoTitle,
            tasks: {
                $in: req.body.tasks
            }
        });
        res.json({
            success: true,
            todos
        })
    } catch (error) {
        console.log(error);
        console.log(error.message);
        res.json({
            success: false,
            message: "Error in search todo"
        })
    }
}

exports.sortTodo = async (req, res) => {
     
}