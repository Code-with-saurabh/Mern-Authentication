const bcrypt = require("bcryptjs")
const JWT = require("jsonwebtoken")
const userModel = require("../models/userModel");
const { JWT_SECRET, NODE_ENV } = require("../Config/Config");
const sendEmail = require("../Services/SendEmail");
const register = async (req,res)=>{
    try{
        const {name,email,password} = req.body;

        if(!name || !email || !password){
            return res.json({
                success:false,
                message:"Missing Details"
            })
        }

        //existing User
        const existingUser = await userModel.findOne({email});  

        if(existingUser){
            return res.json({
                success:false,
                message:`${existingUser.name} User already exists...`
            })
        }

        //hashing password 
        const hashedPassword = await bcrypt.hash(password,10)

        //create User
        const User = new userModel({name,email,password:hashedPassword})

        const NewUser = await User.save()

        //create a token

        const token = JWT.sign({id:NewUser._id},JWT_SECRET,{expiresIn:'7d'});

        res.cookie('token',token,{
            httpOnly:true,
            secure:NODE_ENV==="production",
            sameSite:NODE_ENV==="production"?'none':'strict',
            maxAge:7*24*60*60*1000,
        })

        sendEmail(NewUser.email,"User Register successfully",`Hello ${NewUser.name}`)
          return res.json({
            success:true,
            message:"user register successfully",
            data:{username:NewUser.name,emial:NewUser.email}
        })


    }catch(error){
        res.json({
                success:false,
                message:error.message
            })
    }
}

const login = async(req,res)=>{
    try{
        const {email,password} = req.body;
        if(!password|| !email){
                        return res.json({
                success:false,
                message:"Missing Details"
            })
        }

        const user = await userModel.findOne({email});

        if(!user){
             return res.json({
                success:false,
                message:`Invalid Email....`
            })
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if(!isMatch){
               return res.json({
                success:false,
                message:`Invalid Password....`
            })
        }

                const token = JWT.sign({id:user._id},JWT_SECRET,{expiresIn:'7d'});

        res.cookie('token',token,{
            httpOnly:true,
            secure:NODE_ENV==="production",
            sameSite:NODE_ENV==="production"?'none':'strict',
            maxAge:7*24*60*60*1000,
        })

        return res.json({
            success:true,
            message:"user logged in successfully",
            data:{username:user.name,emial:user.email}
        })


    }catch(error){
        res.json({
                success:false,
                message:error.message
            })
    }
}


const logout = async (req,res)=>{
    try{
        res.clearCookie('token',{
            httpOnly:true,
            secure:NODE_ENV==="production",
            sameSite:NODE_ENV==="production"?'none':'strict',
            maxAge:7*24*60*60*1000,
        })

        return res.json({
            success:true,
            message:"Logged out..."
        })
    }catch(error){
        res.json({
                success:false,
                message:error.message
            })
    }
}


module.exports = {register,login,logout}