const userModel = require("../models/userModel");

const getUserData = async (req,res)=>{
    try{

        const userId =   req.userId;
        
        const user = await userModel.findById(userId);

        if(!user){
            return res.json({
                success:false,
                message:"User Not Found.."
            })
        }

        res.json({
            success:true,
            Userata:{
                name:user.name,
                isAccountVerified:user.isAccountVerified,
            }
        })

    }catch(error){
        res.json({
            success:true,
            message:error.message
        })
    }
}



module.exports = {getUserData}