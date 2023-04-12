const nodemailer = require('nodemailer');
//we will be using ejs to render the email
const ejs = require('ejs');
const path = require('path');
const env = require('./environment');


//defining transporter object which will be attached/assigned to nodemailer
// let transporter = nodemailer.createTransport({
//     service:'gmail',
//     host:'smpt.gmail.com', //gmails mailing server
//     port:587,
//     secure:false,
//     auth:{
//         user:'shivamaggarwal.youngengine@gmail.com',
//         pass:'shivamye2.0'
//     }
// });

let transporter = nodemailer.createTransport(env.smtp);

//it defines,whenever i am going to send an HTML email, where the files would be placed inside views
let renderCommentTemplate = (data,relativePath)=>{
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname,'../views/mailers',relativePath),//relative path is the place from where this function is being called
        data,//context that we pass to ejs
        function(err,template){
            if(err){console.log('error in rendering template',err);return;}
            mailHTML = template;
        }
    )
    return mailHTML;
}

let renderForgotPasswordTemplate = (data,relativePath) => {
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname,'../views/mailers',relativePath),
        data,
        (err,template)=>{
            if(err){console.log('error in rendering forgot password template',err);return;}
            mailHTML = template;
        }
    )
    return mailHTML;
}

module.exports ={
    transporter:transporter,
    renderCommentTemplate:renderCommentTemplate,
    renderForgotPasswordTemplate:renderForgotPasswordTemplate
}