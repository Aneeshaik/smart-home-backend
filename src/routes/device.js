const express = require('express');
const router = express.Router();
const Device = require('../models/Device');

router.get('/', async(req, res) => {
    const devices = await Device.find();
    res.json(devices);
})

router.post('/', async(req, res) => {
    const {name, status} = req.body;
    const device = new Device({name, status});
    await device.save()
    res.json(device)
})

module.exports = router;