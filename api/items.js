const express = require('express');
const router = express.Router();
const database = require('../database.js');

router.get('/items', (req, res) => {
    res.send(`Velkommen til Transporter Addon price api!`);
});

router.get('/items/:itemName', async (req, res) => {
    const itemName = req.params.itemName;

    try {
        // Call getItemByName function from database.js to retrieve the item from the database
        const itemValue = await database.getItemByName(itemName, false);
        res.json({itemValue: itemValue});
    } catch (error) {
        console.error('Error getting item from the database:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to get an item by name ignoring cache
router.get('/items/:itemName/ignore-cache', async (req, res) => {

    if(!req.isAuthorized) {
        return res.status(403).send('Not authorized!');
    }
    

    const itemName = req.params.itemName;
  
    try {
      const itemValue = await database.getItemByName(itemName, true); // Pass true to ignore cache
      res.json({itemValue: itemValue});
    } catch (error) {
      console.error('Error getting item from the database:', error);
      res.status(500).send('Internal Server Error');
    }
  });

router.post('/items/:itemName', async (req, res) => {
    if (req.headers['content-type'] !== 'application/json') {
        return res.status(400).send('Content-Type header must be application/json');
    }

    const itemName = req.params.itemName;
    const itemValue = req.body.itemValue;

    if (isNaN(itemValue)) {
        return res.status(400).send('itemValue skal være et tal!');
    }

    try {
        // Call the addItem function from database.js to add the item to the database
        const newItem = await database.addItem(itemName, itemValue);
        res.status(201).send(`Added ${newItem.name} with value ${newItem.value} to the database`);
    } catch (error) {
        console.error('Error adding item to the database:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
