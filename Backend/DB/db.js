const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        console.log(process.env.MONGO_URI);
        
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`✅ MongoDB connected !! DB HOST: ${conn.connection.host}`);
        return conn; // important: return the connection
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
        process.exit(1); // stop the app if DB is not connected
    }
};

module.exports = connectDB;
