const express = require("express")
const userAuth = require("../MIddleware/userAuth");
const { getUserData } = require("../controllers/UserController");

const userRouter = express.Router();

userRouter.get("/get-user",userAuth,getUserData)

module.exports = userRouter