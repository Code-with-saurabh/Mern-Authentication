const express = require("express")
const {register,login,logout, sendVerifyOTP, verifyEmail} = require("../controllers/authController");
const userAuth = require("../MIddleware/userAuth");

const authRouter = express.Router();

authRouter.post("/register",register)
authRouter.post("/login",login)
authRouter.get("/logout",logout)
authRouter.post("/send-verify-otp",userAuth,sendVerifyOTP)
authRouter.post("/verify-account",userAuth,verifyEmail)

module.exports = authRouter