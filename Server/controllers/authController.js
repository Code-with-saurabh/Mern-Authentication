const bcrypt = require("bcryptjs")
const JWT = require("jsonwebtoken")
const userModel = require("../models/userModel");
const { JWT_SECRET, NODE_ENV } = require("../Config/Config");
const sendEmail = require("../Services/SendEmail");
const OTP = require("../Services/generateOTP");
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

        sendEmail(NewUser.email,"User Register successfully",`Hello ${NewUser.name}`,`
            <h1 style={{textAligen:"center"}}>Hello User ${NewUser.name} </h1>`)
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



const sendVerifyOTP = async(req,res)=>{
    try{
        const userId = req.userId;
        console.log(userId)
        const user = await userModel.findById(userId);

        if(user.isAccountVerified){
            return {success:false,message:"Account Already Verified"}
        }   

        const otp = String(OTP())

        user.verifyotp=otp;
        user.verifyotpExpiereAt=Date.now()+24*60*60*1000;

        await user.save();

        sendEmail(user.email,"OTP Verification from I-WANZER",`Welcome to I-Wanzer. Your Account has been created with email id${user.email}\nYour OTP Is ${otp}`)

        res.json({success:true,message:`Verification OTP Send on EMail ${user.email}`})

    }catch(error){
        res.json({
                success:false,
                message:error.message
            })
    }
}

const verifyEmail = async (req,res)=>{
    const {otp} = req.body;
    // console.log("OTP is ",otp)
    const userId =  req.userId;
    // console.log("User is : ",userId)
    if(!userId || !otp){
        return res.json({sucess:false,message:"MISSING Details"})
    }
    try{

        const user = await userModel.findById(userId)
        // console.log("This is Our User ",user)
        if(!user){
            return res.json({success:false,message:"User not found"})
        }

        if(user.verifyotp === '' || user.verifyotp !== otp){
            // console.log("User OTP is : ",user.verifyotp)
            return res.json({sucess:false,message:"Invalid OTP"})
        }
        
        if(user.verifyotpExpiereAt < Date.now()){
            return res.json({sucess:false,message:"OTP Expierd"})
        }

        user.isAccountVerified=true;
        user.verifyotp="";
        user.verifyotpExpiereAt=0;

        await user.save()

        return res.json({
            success:true,
            message:"Email Verified Successfully"
        })
    }catch(error){
        res.json({
                success:false,
                message:error.message
            })
    }
}


const IsAccountVerified = async(req,res)=>{
    try{
        return res.json({
            success:true
        })
    }catch(error){
        res.json({
            success:false,
            message:error.message
        })
    }
}


const SendResetOTP = async(req,res)=>{
    const {email} = req.body;
    try{
        if(!email){
            return res.json({
                success:false,
                message:"Email is reuired"
            })
        }

        const user = await userModel.findOne({email})

        if(!user){
            return res.json({
                success:false,
                message:"User not found.."
            })
        }

            const otp = String(OTP())

            user.resetOTP = otp;
            user.resetOTPExpireAt=Date.now()+15 * 60 * 1000;

            sendEmail(user.email,"Password Reset OTP",`Your OTPIfor resetting your password is ${otp}.Use this OTP to proceed with resetting your password`)

            await user.save();

            res.json({
                sucess:true,
                message:"OTP sent to your email"
            })

    }catch(error){
        res.json({
            success:false,
            message:error.message
        })
    }
}

const resetPassword = async(req,res)=>{
    const {email,otp,NewPassword} = req.body;

    if(!email || !otp || !NewPassword){
        return res.json({
            success:false,
            message:"Email,OTP and New Password are required"
        })
    }
    try{

        const user = await userModel.findOne({email})

        if(!user){
            return res.json({
                success:false,
                message:"User not found.."
            })
        }

        if(user.resetOTP === '' || user.resetOTP !== otp){
            return res.json({
                success:false,
                message:"Invalid OTP"
            })
        }

        if(user.resetOTPExpireAt < Date.now()){
            return res.json({
                success:false,
                message:"OTP Expired"
            })
        }

        // const hashedPassword = await bcrypt.hash(NewPassword,45);
        const hashedPassword = await bcrypt.hash(NewPassword,10);

        user.password = hashedPassword;
        user.resetOTP='';
        user.resetOTPExpireAt=0;

        await user.save()

        return res.json({success:false,
            message:"Password has been reset successfully"
        })

    }catch(error){
        res.json({
            success:false,
            message:error.message
        })
    }
}

module.exports = {
    register,
    login,
    logout,
    sendVerifyOTP,
    verifyEmail,
    IsAccountVerified,
    SendResetOTP,
    resetPassword
}