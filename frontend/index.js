// we makea da frontend here

const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true})); 
app.set("view engine", "ejs");


/*document.getElementById("btn").addEventListener("click", () => {
    alert("You clicked me!");
});*/


// POST to create a new user. 
app.post("/users", async (req, res) => {
    try {
        const newUser = {
            Username: req.body.Username,
            Password: req.body.Password
        }

        const response = await fetch("http://localhost:3001/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newUser)
        });

        const data = await response.json();
        res.json(data);
        // Return the created user as a response
        // Here I could use the createdUser's id to be stored locally as a login token or something,
        //  but for now I'll just return the created user as a response. I will talk to yall tmr (9/17/2026) about 
        //  how we want to handle logins and sessions and stuff.
    } catch (err) {
        res.status(400).json({error: "Invalid request body"});
        console.error(err);
        return;
    }
    
});

app.get("/users/signup", async (req, res) => {
    res.render("signup.ejs");
});
    


app.listen(3000, () => {
    console.log("Frontend is running on port 3000");
});