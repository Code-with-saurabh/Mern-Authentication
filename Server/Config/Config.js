require("dotenv").config()

module.exports = {
    MONGODB_URL:process.env.MongooseURL,
    PORT:process.env.PORT || 4000, 
}