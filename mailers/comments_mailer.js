const nodeMailer = require('../config/nodemailer');

//same as module.exports = function
//whenever a new comment is made I just need to call this mailer
//gets called in the comments controller
exports.newComment = (comment) => {
    //fetch the HTML of the email
    let htmlString = nodeMailer.renderTemplate({comment:comment},'/comments/new_comment.ejs');

    nodeMailer.transporter.sendMail({
        from:process.env.MAIL_USERNAME,
        to:comment.user.email,
        subject:"New Comment Published",
        html: htmlString
    },(err,info)=>{
        if(err){
            console.log('Error in sending mail',err);
            return;
        }
        // console.log('Message sent',info);
        return;
    });
}