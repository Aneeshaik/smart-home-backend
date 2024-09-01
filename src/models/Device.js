const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    name : {
        type: String,
        required: true,
    },
    status : {
        type: String,
        required: true,
    },
    lastUpdated : {
        type: Date,
        default: Date.now
    }
})

const Device = mongoose.model('Device', DeviceSchema);

module.exports = Device;