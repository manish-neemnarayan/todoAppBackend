const mongoose = require("mongoose");

/**
 * 1. authSchema for auhtentication part
 * 2. userSchema for having name, email and todoSchema using populate
 * 3. todoSchema for having todo-title and tasks[]
 */

// 1. Authentication Schema
const authSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        maxLength: 18
    },

    email: {
        type: String,
        trim: true,
        require: true,
        unique: true
    },

    password: {
        type: String
    },

    token: String
})

// 2. user and todo schema
const todosSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth"
    },
    todoTitle: {
        type: String,
        require: true,
        maxLength: 30
    },
    tasks: [{
        type: String,
        trim: true,
        require: true
    }],
},
{
    timestamps: true
}
)

// Exporting models
const Auth = mongoose.model("Auth", authSchema);
const Todos = mongoose.model("Todos", todosSchema);
module.exports = {Auth, Todos};