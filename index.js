const express = require('express');
const dotenv = require('dotenv');
const mongodb = require('mongodb');
const cors = require('cors');
const connectDB = require('./db')

const PORT = process.env.PORT || 5000
const app = express();

connectDB();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Smart Home DashBoard Backend!')
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
} )