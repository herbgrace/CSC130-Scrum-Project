const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

require('dotenv').config({path: "./credentials.env"});
const { DAL } = require('./DAL');




app.post("/api/users", async (req, res) => {
    try {
        if (!req.body.Username || !req.body.Password) {
            res.status(400).json({error: "Username and Password are required"});
            return;
        }
        
        const newUser = {
            Username: req.body.Username,
            Password: req.body.Password
        }

        const createdUser = await DAL.createUser(newUser);
        res.json(createdUser);  
    } catch (err) {
        res.status(400).json({error: "Invalid request body"});
        console.error(err);
        return;
    }
});

app.post("/api/login", async (req, res) => {
    try {
        if (!req.body.Username || !req.body.Password) {
            res.status(400).json({error: "Username and Password are required"});
            return;
        }

        const user = await DAL.getUserByUsername(req.body.Username);
        if (!user || user.Password !== req.body.Password) {
            res.status(401).json({error: "Invalid username or password"});
            return;
        }

        res.json(user);
    } catch (err) {
        res.status(400).json({error: "Invalid request body"});
        console.error(err);
        return;
    }
});

app.get("/api/users/:id", async (req, res) => {
    try {
        const user = await DAL.getUserById(parseInt(req.params.id));
        if (!user) {
            res.status(404).json({error: "User not found"});
            return;
        }
        res.json(user);
    } catch (err) {
        res.status(400).json({error: "Error fetching user"});
        console.error(err);
    }
});

app.post("/api/users/:id/todos", async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const user = await DAL.getUserById(userId);
        if (!user) {
            res.status(404).json({error: "User not found"});
            return;
        }

        const newTodo = {
            Id: user.ToDo.length + 1,
            Task: req.body.Task,
            Completed: false
        };

        user.ToDo.push(newTodo);
        await DAL.updateUser({Id: userId, ToDo: user.ToDo});
        res.json(newTodo);
    } catch (err) {
        res.status(400).json({error: "Error adding todo"});
        console.error(err);
    }
});

        
app.listen(3001, () => {
    console.log("Backend is running on port 3001");
});