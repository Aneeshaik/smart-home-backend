const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
        id: {
            type: Number,
            required: true,
        },
        icon: {
            type: String,
            required: true,
        },
        name : {
            type: String,
            required: true,
        },
        status : {
            type: Boolean,
            required: true,
        },
        lastUpdated : {
            type: Date,
            default: Date.now
        }
})

const roomsSchema = new mongoose.Schema({
    roomName: {
        type: String,
        required: true
    },
    aC: {
        type: Boolean,
    },
    devices: [deviceSchema]
})

const houseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    rooms: [roomsSchema]
})

const House = mongoose.model('House', houseSchema);
const Device = mongoose.model('Device', deviceSchema);
const Rooms = mongoose.model('Rooms', roomsSchema)

module.exports = {Device, Rooms, House}