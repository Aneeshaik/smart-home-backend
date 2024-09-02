const express = require('express');
const path = require('path');
const app = express()
app.use(express.static(path.join(__dirname, 'public')))

const mockData = [
    {
      id: 1,
      icon: 'security-icon.svg',
      name: 'Security',
      status: 'off',
    },
    {
      id: 2,
      icon: 'camera-icon.svg',
      name: 'Camera',
      status: 'on',
    },
    {
      id: 3,
      icon: 'light-icon.svg',
      name: 'Light',
      status: 'off',
    },
    {
        id: 4,
        icon: 'fan-grey-icon.svg',
        name: 'Fan',
        status: 'off',
    },
    {
        id: 5,
        icon: 'tv-icon.svg',
        name: 'TV',
        status: 'on',
    },
    {
        id: 6,
        icon: 'fridge.svg',
        name: 'Fridge',
        status: 'on',
    },
    {
        id: 7,
        icon: 'heater.svg',
        name: 'Heater',
        status: 'off',
    },
    {
        id: 8,
        icon: 'coffee-maker.svg',
        name: 'COffee Maker',
        status: 'off',
    }
  ];
  
module.exports = mockData
  