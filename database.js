const { Pool } = require('pg');
const Cache = {};
require('dotenv').config();

// Create a new PostgreSQL pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Necessary to accept connections on Heroku
    }
});


async function addItem(itemName, itemValue) {
    // Check if the item already exists in the database
    const existingItemQuery = 'SELECT * FROM items WHERE name = $1';
    const existingItemValues = [itemName];

    try {
        const existingItemResult = await pool.query(existingItemQuery, existingItemValues);
        if (existingItemResult.rows.length > 0) {
            // If the item exists, update its value
            const updateQuery = 'UPDATE items SET value = $1 WHERE name = $2 RETURNING *';
            const updateValues = [itemValue, itemName];
            const updateResult = await pool.query(updateQuery, updateValues);
            // After updating the value, delete the cached value associated with getItemByName
            return updateResult.rows[0];
        } else {
            // If the item does not exist, insert a new record
            const insertQuery = 'INSERT INTO items (name, value) VALUES ($1, $2) RETURNING *';
            const insertValues = [itemName, itemValue];
            const insertResult = await pool.query(insertQuery, insertValues);
            // After adding a new item, delete the cached value associated with getItemByName
            return insertResult.rows[0];
        }
    } catch (error) {
        console.error('Error adding/updating item in the database:', error);
        throw error;
    }
}

async function getItemByName(itemName, ignoreCache) {
    if (Cache[itemName] !== undefined && !ignoreCache) {
        return Cache[itemName]; // Return cached value if available
    }

    const query = 'SELECT * FROM items WHERE name = $1';
    const values = [itemName];

    try {
        const result = await pool.query(query, values);
        const item = result.rows[0];
        if (item) {
            Cache[itemName] = item.value; // Cache the retrieved value
            return item.value;
        } else {
            return 0; // Item not found in database
        }
    } catch (error) {
        console.error('Error getting item from the database:', error);
        throw error;
    }
}

// Export the functions to be used in other modules
module.exports = {
    addItem,
    getItemByName
};