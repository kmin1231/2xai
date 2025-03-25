// db/connect.js

require('dotenv').config();
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const dbURI = process.env.MONGO_URI;

        await mongoose.connect(dbURI);

        console.log('Database connection success!');
    } catch (error) {
        console.error('Database connection failed: ', error);
        process.exit(1);
    }
};

module.exports = connectDB;