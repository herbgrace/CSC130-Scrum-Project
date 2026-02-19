// we makea da frontend here

const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public")); 
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
        //  but for now I'll just return the created user as a response. 
    } catch (err) {
        res.status(400).json({error: "Invalid request body"});
        console.error(err);
        return;
    }
    
});

app.get("/users/signup", async (req, res) => {
    res.render("signup.ejs");
});

app.get("/dashboard", (req, res) => {
    res.render("dashboard.ejs");
});

app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.post("/login", async (req, res) => {
    try {
        const response = await fetch("http://localhost:3001/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Username: req.body.Username,
                Password: req.body.Password
            })
        });

        const data = await response.json();

        if (response.ok) {
            res.cookie("userId", data.Id);
            res.redirect("/dashboard");
        } else {
            res.status(401).render("login.ejs", {error: data.error || "Login failed"});
        }
    } catch (err) {
        res.status(400).render("login.ejs", {error: "Login failed"});
        console.error(err);
    }
}); 

app.listen(3000, () => {
    console.log("Frontend is running on port 3000");
});

app.get("/homepage", async (req, res) => {
    res.render("homepage.ejs");
});