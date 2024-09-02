require('dotenv').config()
const mongoose = require('mongoose')
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('Database Connected!'))
    } catch (error) {
        console.error("Database connection failed", error);
        process.exit(1);
    }
};
module.exports = { connectDB, conn: mongoose.connection }