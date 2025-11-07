const JWT = require("jsonwebtoken");
const { JWT_SECRET } = require("../Config/Config");


const userAuth = async (req,res,next)=>{
    const {token} = req.cookie;
    if(!token){
        return res.json({
            success:false,
            message:"Not Authorized. Login Again"
        })
    }
    try{
        const Data = JWT.verify(token,JWT_SECRET)

        if(Data.id){
            req.body.userId = Data.id;
        }else{
            return res.json({
            success:false,
            message:"Not Authorized. Login Again"
        })
        }
        next();
    }catch(error){
        res.json({
                success:false,
                message:error.message
            })
    }
}


module.exports = userAuth;