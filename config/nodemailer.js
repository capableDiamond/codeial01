const nodemailer = require('nodemailer');
//we will be using ejs to render the email
const ejs = require('ejs');
const path = require('path');


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

let transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        type:'OAUTH2',
        user:process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
        clientId:process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN
    }
});

//it defines,whenever i am going to send an HTML email, where the files would be placed inside views
let renderTemplate = (data,relativePath)=>{
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname,'../views/mailers',relativePath),//relative path is the place from where this function is being called
        data,//contect that we pass to ejs
        function(err,template){
            if(err){console.log('error in rendering template',err);return;}
            mailHTML = template;
        }
    )
    return mailHTML;
}

module.exports ={
    transporter:transporter,
    renderTemplate:renderTemplate
}