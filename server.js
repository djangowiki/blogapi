const express = require('express');
const dotenv = require('dotenv');

// Custom Imports
const dbConnection = require('./config/db');


const app = express();
dotenv.config()

// DB
dbConnection()

// Server
const PORT = process.env.PORT || 4000
app.listen(PORT, console.log(`Server listening on ${PORT}`));
