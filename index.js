const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose')
const mongodb = require('mongodb');
const cors = require('cors');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { House } = require('./src/models/House')
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

const updateDeviceStatus = async(houseId, roomId, deviceId, updatedDevice) => {
    const houseIdObj = mongoose.Types.ObjectId.createFromHexString(houseId);
    const roomIdObj = mongoose.Types.ObjectId.createFromHexString(roomId);
    const deviceIdObj = mongoose.Types.ObjectId.createFromHexString(deviceId);
    try {
        const house = await House.findOneAndUpdate(
            { _id: houseIdObj, "rooms._id": roomIdObj, "rooms.devices._id": deviceIdObj },
            {
                $set: {
                    "rooms.$[room].devices.$[device]": updatedDevice
                }
            },
            {
                new: true,
                arrayFilters: [
                    { "room._id": roomIdObj },
                    { "device._id": deviceIdObj }
                ]
            }
        );
        if (!house) {
            throw new Error('Device not found');
        }
        const updatedRoom = house.rooms.id(roomIdObj);
        const updatedDeviceObj = updatedRoom.devices.id(deviceIdObj);

        return updatedDeviceObj;
    } catch (error) {
        throw new Error(`Error updating device status: ${error.message}`);
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

// app.get('/api/devices', async(req, res) => {
//     const devices = await Device.find()
//     res.json(devices)
// })

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

app.put('/houses/:houseId/rooms/:roomId/devices/:deviceId', async (req, res) => {
    const { houseId, roomId, deviceId } = req.params;
    const updatedDevice = req.body;
    // console.log(updatedDevice);
    
    try {
        // Update the status in your database or data storage
        const updatedDeviceFromBackend = await updateDeviceStatus(houseId, roomId, deviceId, updatedDevice);
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
            return res.status(401).json({message: "User not found! Sign up now."})
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
        res.status(201).json({message: "Successfully Registered!", token, userId})
    }
    catch(error){
        res.status(500).json({message: "Registration Failed"})
        console.error(error)
    }
})

app.post('/house', authMiddleware, async(req, res) => {
    const { room } = req.body
    try {
        const userId = req.user.userId
        const existingHouse = await House.findOne({userId: userId})
        if(existingHouse){
            existingHouse.rooms.push(room);
            await existingHouse.save();
            return res.status(201).json({message: "Successfully appended room", house: existingHouse})
        } else {
        const newHouse = new House({
            userId: userId,
            userName: req.body.userName,
            rooms: req.body.room
        })
        await newHouse.save();
        res.status(201).json({message: "House Added Successfully,", house: newHouse})
    }
    }
    catch(error){
        res.status(401).json(error);
    }
})

app.get('/house', authMiddleware, async(req, res) => {
    const userId = req.user.userId
    const data = await House.findOne({userId: userId}).populate('userId');
    res.status(200).json(data);
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})