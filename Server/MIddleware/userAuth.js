const JWT = require("jsonwebtoken");
const { JWT_SECRET } = require("../Config/Config");


const userAuth = async (req,res,next)=>{
    const {token} = req.cookies;
    // console.log("The Token is ",token)
    if(!token){
        return res.json({
            success:false,
            message:"Not Authorized. Login Again"
        })
    }
    try{
        const Data = JWT.verify(token,JWT_SECRET)
        
        if(Data.id){
            req.userId = Data.id;
        }else{
            return res.json({
                success:false,
                message:"Not Authorized. Login Again"
            })
        }
        console.log(Data)
        // cons
        next();
    }catch(error){
        res.json({
                success:false,
                message:error.message
            })
    }
}


module.exports = userAuth;