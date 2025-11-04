const mongoose = require("mongoose");
const { MONGODB_URL } = require("../Config/Config");

const connectDB = async()=>{
    try{
        const connect  = await mongoose.connect(`${MONGODB_URL}/mern-auth`);
        // mongoose.connection.on('connected',()=>console.log(`✅ MongoDB Connected: ${connect.connection.host}`))
        console.log(`✅ MongoDB Connected: ${connect.connection.host}`)
        return true;
    }catch(error){
        if (error.name === "MongooseServerSelectionError" || error.name === "MongoNetworkError") {
        console.error("❌ Connection failed: Please check your MongoDB URL or your internet connection.");
    } else {
        console.error(`❌ Error: ${error.message}`);
    }
    return false;
    }
}

module.exports = connectDB;