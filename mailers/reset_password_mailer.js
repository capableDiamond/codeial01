const nodeMailer = require('../config/nodemailer');

exports.resetPasswordMail = (data)=>{
    //fetch the HTML of Email
    let htmlString = nodeMailer.renderForgotPasswordTemplate({data:data},'/reset_password/reset_password.ejs');

    nodeMailer.transporter.sendMail({
        from:process.env.MAIL_USERNAME,
        to:data.user.email,
        subject:"Reset Password",
        html:htmlString
    },(err,info)=>{
        if(err){console.log('Error in sending reset password email',err);return;}
        console.log('Reset Password mail sent',info);
        return;
    });
}