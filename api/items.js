const express = require('express');
const router = express.Router();

router.get('/items', (req, res) => {
    res.send(`Velkommen til Transporter Addon price api!`);
});

router.get('/items/:itemName', (req, res) => {
    const itemName = req.params.itemName;
    res.send(`Item: ${itemName}`);
});

router.post('/items/:itemName', (req, res) => {
    if (req.headers['content-type'] !== 'application/json') {
        return res.status(400).send('Content-Type header must be application/json');
    }

    const itemName = req.params.itemName;
    const itemValue = req.body.itemValue;

    if (isNaN(itemValue)) {
        return res.status(400).send('itemValue skal være et tal!');
    }

    res.status(201).send(`Updated ` + itemName + " item value to " + itemValue);
});

module.exports = router;