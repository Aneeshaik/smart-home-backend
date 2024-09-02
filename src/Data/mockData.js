const express = require('express');
const path = require('path');
const app = express()
app.use(express.static(path.join(__dirname, 'public')))

const mockData = [
    {
      id: 1,
      icon: 'security-icon.svg',
      name: 'Security',
      status: false,
    },
    {
      id: 2,
      icon: 'camera-icon.svg',
      name: 'Camera',
      status: true,
    },
    {
      id: 3,
      icon: 'light-icon.svg',
      name: 'Light',
      status: false,
    },
    {
        id: 4,
        icon: 'fan-grey-icon.svg',
        name: 'Fan',
        status: false,
    },
    {
        id: 5,
        icon: 'tv-icon.svg',
        name: 'TV',
        status: true,
    },
    {
        id: 6,
        icon: 'fridge.svg',
        name: 'Fridge',
        status: true,
    },
    {
        id: 7,
        icon: 'heater.svg',
        name: 'Heater',
        status: false,
    },
    {
        id: 8,
        icon: 'coffee-maker.svg',
        name: 'Coffee Maker',
        status: false,
    }
  ];
  
module.exports = mockData
  