require('dotenv').config();

const express = require('express')
const fs = require('fs');
const path = require('path');
const app = express()
const port = 3000

app.use(express.json());

function authorize(req, res, next) {
  req.isAuthorized = true;
  // Check if Authorization header is present

  const authHeader = req.headers.authorization;

  // For other methods, require token
  if (!authHeader) {
      req.isAuthorized = false;
      if (req.method === 'GET') {
          return next();
      }
      return res.status(401).send('Authorization header is missing');
  }

  // Validate the token (e.g., against a database or some other mechanism)
  if (authHeader !== process.env.SECRET_KEY) {
      req.isAuthorized = false;
      if (req.method === 'GET') {
          return next();
      }
      return res.status(403).send('Invalid token');
  }

  // Authorization successful
  next();
}

app.use(authorize);

// Function to dynamically load routes from the api folder
function loadRoutesFromDirectory(directory) {
  fs.readdirSync(directory).forEach(file => {
      const fullPath = path.join(directory, file);
      const route = require(fullPath);
      app.use('/', route); // Assuming each route exports an Express router
  });
}

// Load routes from the api directory
const apiDirectory = path.join(__dirname, 'api');
loadRoutesFromDirectory(apiDirectory);

app.listen(port, () => {
  console.log("Server Listening on PORT:", port);
})


//load discord bot
require("./discordBot.js")