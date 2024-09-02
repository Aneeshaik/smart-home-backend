const express = require('express');
const dotenv = require('dotenv');
const mongodb = require('mongodb');
const cors = require('cors');
const Device = require('./src/models/Device')
const connectDB = require('./db');
const mockData = require('./src/Data/mockData')
const deviceRoutes = require('./src/routes/device')
const path = require('path')

const PORT = process.env.PORT || 5000
const app = express();

connectDB();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')))
// app.use('/api/devices', deviceRoutes)

const insertMockdata = async() => {
    const items = await Device.find();
    if (items.length === 0){
        await Device.insertMany(mockData);
    }
    // await Device.deleteMany()
}

insertMockdata();

app.get('/', (req, res) => {
    res.send('Smart Home DashBoard Backend!')
})

app.get('/api/devices', async(req, res) => {
    const devices = await Device.find()
    res.json(devices)
})

app.get('/images/:imageName', (req, res) => {
    const { imageName } = req.params
    const imagePath = path.join(__dirname, 'public/images', imageName);
    res.sendFile(imagePath);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})