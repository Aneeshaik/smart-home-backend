const mongoose = require('mongoose');
const mongodb = require('mongodb');

const connectDB = () => {
    mongoose.connect('mongodb://127.0.0.1:27017/smartHomeDB',{
        useNewUrlParser : true,
        useUnifiedTopology : true
    })
    .then(() => {
        console.log("Mongoose Connexted");
    })
    .catch((error) => {
        console.log("Mongoose error:", error);
        
    })
} 

module.exports = connectDB