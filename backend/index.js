const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

require('dotenv').config({path: "./credentials.env"});
const { DAL } = require('./DAL');




app.post("/api/users", async (req, res) => {
    try {
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

        
app.listen(3001, () => {
    console.log("Backend is running on port 3001");
});