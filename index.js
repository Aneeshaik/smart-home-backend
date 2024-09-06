const express = require('express');
const dotenv = require('dotenv');
const mongodb = require('mongodb');
const cors = require('cors');
const bcrypt = require('bcrypt')
const Device = require('./src/models/Device')
const connectDB = require('./db');
const mockData = require('./src/Data/mockData')
const deviceRoutes = require('./src/routes/device')
const path = require('path')
const bodyParser = require('body-parser')
const User = require('./src/models/User')


const PORT = process.env.PORT || 5000
const app = express();
const router = express.Router();

connectDB();
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')))
// app.use('/api/devices', deviceRoutes)

const insertMockdata = async() => {
    const items = await Device.find();
    if (items.length === 0){
        await Device.insertMany(mockData);
    }
    // await Device.deleteMany();
}
const updateDeviceStatus = async(deviceId, updatedDevice) => {
    try {
        const device = await Device.findByIdAndUpdate(deviceId, updatedDevice, {new : true})
        if (!device) {
            throw new Error('Device not found');
        }
        return device;
    } catch (error) {
        throw new Error('Error updating device status:', error);
    }
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

app.put('/api/devices/:id', async (req, res) => {
    const deviceId = req.params.id;
    const updatedDevice = req.body;
    // console.log(updatedDevice);
    
    try {
        // Update the status in your database or data storage
        const updatedDeviceFromBackend = await updateDeviceStatus(deviceId, updatedDevice);

        res.status(200).json(updatedDeviceFromBackend);
    } catch (error) {
        console.error('Error updating device status:', error);
        res.status(500).json({ error: 'Failed to update device status' });
    }
})

app.post('/register', async(req, res) => {
    const { firstName, lastName, password, email } = req.body;
    try{
        const existedUser = User.findOne({email})
        if(existedUser) {
            return res.status(400).json({error: 'Email already exists'})
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword
        })
        await user.save()
    }
    catch(error){
        console.error(error)
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})