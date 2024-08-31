const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
    },
    type : {
        type: String,
        required: true,
    },
    status : {
        type: String,
        required: true,
    },
    lastUpdated : {
        type: Time,
        default: Time.now
    }
})

const Device = mongoose.model('Device', DeviceSchema);

module.exports = Device;