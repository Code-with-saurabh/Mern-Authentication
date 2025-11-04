require("dotenv").config()

module.exports = {
    MONGODB_URL:process.env.MongooseURL,
    PORT:process.env.PORT || 4000, 
    JWT_SECRET:process.env.JWT_SECRET,
    NODE_ENV:process.env.NODE_ENV,
}