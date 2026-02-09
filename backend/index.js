require('dotenv').config({path: "./credentials.env"});
const { DAL } = require('./DAL');

DAL.getUserById(1).then(data => {
    console.log(data);
})