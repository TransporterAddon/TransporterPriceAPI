const express = require('express');
const router = express.Router();
const database = require('../database.js');

router.get('/items', async (req, res) => {
    items = ["sand","redsand","stone","cobblestone","smooth_brick","dirt","grass","charcoal","coal","ironore","goldore","ironingot","goldingot","bone","glowstonedust","glowstone","lapislazuli","quartz","redstone","diamond","obsidian","blazerod","enderpearl","book","sugarcane","leather","oaklog","sprucelog","birchlog","junglelog","slimeball","chest","trappedchest","hopper","white_wool","orange_wool","magenta_wool","light_blue_wool","yellow_wool","lime_wool","pink_wool","gray_wool","light_gray_wool","cyan_wool","purple_wool","blue_wool","brown_wool","green_wool","red_wool","black_wool","white_stained_glass","orange_stained_glass","magenta_stained_glass","light_blue_stained_glass","yellow_stained_glass","lime_stained_glass","pink_stained_glass","gray_stained_glass","light_gray_stained_glass","cyan_stained_glass","purple_stained_glass","blue_stained_glass","brown_stained_glass","green_stained_glass","red_stained_glass","black_stained_glass","cocoa_beans","spruce_sapling","glass","emerald","emerald_block"];
    const itemValues = await database.getItemsByNames(items, false);
    res.json(itemValues);
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
