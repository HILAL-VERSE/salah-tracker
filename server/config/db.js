const mongoos = require("mongoose");

const connectDB = async () => {
    try {
        await mongoos.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected");
    } catch (error) {
        console.error("Database connection failed:",error.message);
        process.exit(1);
    }
};

module.exports = connectDB;