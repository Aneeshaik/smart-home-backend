const express = require('express');
const dotenv = require('dotenv');
const mongodb = require('mongodb');
const cors = require('cors');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { Device, House } = require('./src/models/House')
const connectDB = require('./db');
const mockData = require('./src/Data/mockData')
const path = require('path')
const bodyParser = require('body-parser')
const User = require('./src/models/User')

const PORT = process.env.PORT || 5000
const app = express();
const router = express.Router();
dotenv.config();

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
insertMockdata();

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

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization
    // console.log(authHeader);
    if(!authHeader){
        res.status(401).json({error: "Unauthorized"})
    }
    const token = authHeader.split(' ')[1]
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        // console.log(decoded)
        req.user = decoded
        next()
    }
    catch(error){
        res.status(401).json({error: "Invalid token"})
    }
}

app.get('/', (req, res) => {
    res.send('Smart Home DashBoard Backend!')
})

app.get('/api/devices', async(req, res) => {
    const devices = await Device.find()
    res.json(devices)
})

app.get('/users/:id', async(req,res) => {
    const user = await User.findOne({_id: req.params.id})
    res.json(user)
})

app.get('/images/:imageName', (req, res) => {
    const { imageName } = req.params
    const imagePath = path.join(__dirname, 'public/images', imageName);
    res.sendFile(imagePath);
});

app.get('/auth/check', authMiddleware, (req, res, next) => {
    res.json({isRegistered: true})
})

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

app.post('/signin', async(req, res) => {
    const { email, password } = req.body;
    try{
        const user = await User.findOne({email})
        if(!user){
            return res.status(401).json({message: "Invalid username"})
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({message: "Invalid password"})
        }
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'})
        const userId = user._id
        res.status(201).json({message: "Successfully logged in!", token, userId})
    }
    catch(error){
        res.status(500).json({message: 'Server Error'})
    }
})

app.post('/signup', async(req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try{
        const existedUser = await User.findOne({email})
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
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'})
        const userId = user._id
        res.status(201).json({message: "Registration Successful", token, userId})
    }
    catch(error){
        res.status(500).json({message: "Registration Failed"})
        console.error(error)
    }
})

app.post('/house', async(req, res) => {
    const {userName, room} = req.body
    try {
        const existingHouse = await House.findOne({userName})
        if(existingHouse){
            existingHouse.rooms.push(room);
            await existingHouse.save();
            return res.status(201).json({message: "Successfully appended room", existingHouse})
        } else {
        const newHouse = new House({
            userName: req.body.userName,
            rooms: req.body.room
        })
        await newHouse.save();
        res.status(201).json({message: "House Added Successfully,", newHouse})
    }
    }
    catch(error){
        res.status(401).json(error);
    }
})

app.get('/house', async(req, res) => {
    const data = await House.find();
    res.status(200).json(data);
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})