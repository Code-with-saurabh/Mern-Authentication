const nodemailer = require("nodemailer")
const { EMAIL, PASSWORD } = require("../Config/Config")

const transporter = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:465,
    secure:true,
    auth:{
        user:EMAIL,
        pass:PASSWORD
    }
})


const sendEmail = async(to,subject,text,html)=>{
    try{
        const response = await transporter.sendMail({
            from:EMAIL,
            to,
            subject,
            text,
            html
        })

        console.log(`Email send to ${to}`,response.messageId)
        return response.messageId;

    }catch(err){
        console.log("Error Aaaya hai Dekho",err)
        return err;
    }
}

module.exports = sendEmail;