const mongoose = require('mongoose');
const { Schema, Model } = mongoose;
mongoose.connect(process.env.MONGO_URI);

const UserSchema = new Schema({
    Id: Number,
    Username: String,
    Password: String,
    ToDo: [{Id: Number, Task: String, Completed: Boolean}]
})
const User = mongoose.model('User', UserSchema);

module.exports.DAL = {
    getUserById : async function(id) {
        return await User.find({"Id": id})
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