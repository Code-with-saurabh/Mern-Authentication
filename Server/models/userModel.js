const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name:{type:String,require:true},
    email:{type:String,require:true,unique:true},
    password:{type:String,require:true},
    verifyotp:{type:String,default:''},
    verifyotpExpireAt:{type:Number,default:0},
    isAccountVerified:{type:Boolean,default:false},
    resetOTP:{type:String,default:''},
    resetOTPExpireAt:{type:Number,default:0}
})

const userModel = mongoose.model('user',UserSchema);

module.exports = userModel;