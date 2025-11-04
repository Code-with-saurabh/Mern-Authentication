require("dotenv").config()

const express = require("express")
const cors = require("cors");
const cookieParser = require("cookie-parser")


const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(cors({credentials:true}))





app.listen(PORT,()=>{
    console.log(`Server Started on PORT : ${PORT}`)
})