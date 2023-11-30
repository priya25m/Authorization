const mongoose = require("mongoose");

require('dotenv').config();

if (process.env.MONGODB_URI) {
    new Error("Please set MONGODB_DB AND MONGODB_URI ");
}
const connectDatabase = async () => {
    if (!mongoose.connections[0].readyState) {
        try {
            const con = await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log(`MongoDB is Connected with Host: ${con.connection.host}`);
        } catch (error) {
            console.log("Error connecting to mongo.", error);
        }
    }
};

module.exports = connectDatabase;