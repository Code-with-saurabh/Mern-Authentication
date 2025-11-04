 
const express = require("express")
const cors = require("cors");
const cookieParser = require("cookie-parser")
const path = require("path");
const connectDB = require("./Services/mongodb_connect");
const { PORT } = require("./Config/Config");

const app = express();
const authRouter = require("./Routes/authRoutes")



app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(cors({credentials:true}))


app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname, 'Views', 'index.html'));
})

app.use("/auth/api",authRouter)

async function dbConnect(){
    try{
        const Res = await connectDB();
       
        if(Res){
            app.listen(PORT,()=>{
    console.log(`Server Started on PORT : ${PORT}`)
})
        }else{
            console.log("DataBase is not Connected...")
        }
    }catch(error){
         console.error(`❌ Error: ${error.message}`);
    }
}


dbConnect();