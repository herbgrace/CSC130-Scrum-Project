const mongoose = require('mongoose');
const { Schema, Model } = mongoose;

const ToDoSchema = new Schema({
    Id: Number,
    Task: {type: String, required: true},
    Completed: {type: Boolean, default: false}
})

const UserSchema = new Schema({
    Id: {type: Number, unique: true},
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    ToDo: [ToDoSchema]
})
const User = mongoose.model('User', UserSchema);

async function openConnection() {
    await mongoose.connect(process.env.MONGO_URI)
        .then(console.log("Connected to Mongo!"))
}

async function closeConnection() {
    await mongoose.disconnect()
        .then(console.log("Disconnected from Mongo!"))
}

// All the interactions with the Mongo DB
module.exports.DAL = {
    /**
     * Finds a user in the database based on the given Id
     * @param {int} id The Id of the user that should be found.
     * @returns {object} An object containting the Json information of the found user.
     * @returns {null} null if the requested Id cannot be found.
     */
    getUserById : async function(id) {
        await openConnection();
        const result = await User.findOne({"Id": id})
        closeConnection();
        return result;
    },

    /**
     * Creates a new user in the database. 
     * @param {object} userJson An object containing the new user's 'Username' & 'Password'
     * 
     * - Can optionally contain an 'ToDo' array full of objects.
     * 
     * - ToDos consist of an Id (int), Task (String), & Completed (Boolean) field
     * @returns {object} The Json for the new created user.
     * @throws {ValidationError} When Username/Password (or a ToDo's Task) are missing or null.
     */
    createUser : async function(userJson) {
        if (!userJson.Username || !userJson.Password) {
            throw new Error("Username and Password need to be defined.")
        }
        if (!userJson.ToDo) {
            userJson.ToDo = [];
        }

        await openConnection();

        let highestId = await User.find({}, ["Id"], {limit: 1, sort: {Id: -1}});
        highestId = highestId[0].Id

        userJson.Id = highestId + 1;
        const newUser = await User.create(userJson);
        console.log("New user successfully created")

        await closeConnection();
        return newUser;
    },

    /**
     * 
     * @param {object} userJson The Json containing the user's new information.
     * 
     * - Id (int) : Required - Used to find the user to update
     * 
     * - Username (String) : Optional - Will Overwrite the previous username
     * 
     * - Password (String) : Optional - Will Overwrite the previous password
     * @returns {Boolean} Boolean value showing if the update was successful or not.
     * @throws {Error} When the Id isn't properly provided.
     */
    updateUser : async function(userJson) {
        if (!userJson.Id) {
            throw new Error("Cannot update a user with no Id");
        }
        await openConnection();

        const res = await User.updateOne({Id: userJson.Id}, userJson);
        await closeConnection();

        return res.modifiedCount === 1;
    },

    /**
     * Deletes a user from the database based off the provided Id
     * @param {int} userId The Id of the user that should be deleted. 
     * @returns {Boolean} Boolean value showing if the User was deleted successfully.
     * @throws {Error} When the Id isn't properly provided.
     */
    deleteUser : async function(userId) {
        if (!userId) {
            throw new Error("Cannot delete a user with no Id");
        }

        await openConnection();

        const res = await User.deleteOne({Id: userId});

        await closeConnection();
        return res.deletedCount === 1
    },

    /**
     * Finds a user by username and password (for login)
     * @param {string} username The username to search for
     * @param {string} password The password to match
     * @returns {object} User object if found and password matches
     * @returns {null} null if not found or password doesn't match
     */
    getUserByUsernameAndPassword : async function(username, password) {
        await openConnection();
        const result = await User.findOne({"Username": username, "Password": password});
        await closeConnection();
        return result;
    },

    /**
     * Finds a user by username only
     * @param {string} username The username to search for
     * @returns {object} User object if found
     * @returns {null} null if not found
     */
    getUserByUsername : async function(username) {
        await openConnection();
        const result = await User.findOne({"Username": username});
        await closeConnection();
        return result;
    }
}

// User:
//   Id: (Int)
//   Username (string)
//   Password (string - ideally hashed)
//   To-Do (list of objects)

// To-Dos
//   Id (Int)
//   Task (string)
//   Completed (boolean)