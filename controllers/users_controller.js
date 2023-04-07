const User = require('../models/user');
const ResetPasswordToken = require('../models/resetPasswordToken');
const crypto = require('crypto');
const resetPasswordMailer = require('../mailers/reset_password_mailer');

//require the file system to delete the previous avatar images
const fs = require('fs');
const path = require('path');

const fileType = require('file-type');
const { model } = require('mongoose');


module.exports.profile = function(req,res){
    User.findById(req.params.id,function(err,user){
        return res.render('users',{
            title:'User Profile',
            profile_user:user
        });
    });
}

//renders the sign up page
module.exports.signUp = function(req,res){
    if(req.isAuthenticated()){ //this prevents signed in users from accessing this page while they are signed in
       return res.redirect('/');
    }else{
        return res.render('user_sign_up',{
            title:'Codeial | Sign Up'
        });
    }
}

//renders the sign in page
module.exports.signIn = function(req,res){
    //this function is call to the sign in page
    if(req.isAuthenticated()){ //this prevents signed in users from accessing this page while they are signed in
        return res.redirect('/');
    }
    else{
        return res.render('user_sign_in',{
            title:'Codeial | Sign in'
        });
    }
}

//Get the sign up data
module.exports.create = function(req,res){
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }

    User.findOne({email:req.body.email},function(error,user){
        if(error){
            console.log('Error in finding user in signing up');
            return;
        }

        if(!user){
            User.create(req.body,function(err,user){
                if(error){
                    console.log('Error in creating user while signing up');
                    return;
                }

                return res.redirect('/users/sign-in');
            })
        }else{
            return res.redirect('back');
        }
    });
}

//sign in and create a session for the user
module.exports.createSession = function(req,res){
    req.flash('success','Logged in Successfuly');//setting the flash messages,this is connected to req though what we are sending back is the response
    return res.redirect('/');
}

module.exports.destroySession = function(req,res){
    req.logout(function(err){//logout is a function of passport library
        if(err){console.log('Error in Logging out');return;}
        req.flash('success','You have Logged Out!');
        return res.redirect('/');
    });
}

module.exports.update = async function(req,res){
    
    // if(req.user.id == req.params.id){
    //     User.findByIdAndUpdate(req.params.id,req.body,function(err,user){
    //         req.flash('success','Updated!');
    //         return res.redirect('back');
    //     });
    // }else{
    //     req.flash('error','Unauthorized');
    //     return res.status(401).send('Unauthorized');
    // }
    const whitelist = [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/webp'
    ];
    //to check if the info of the logged in user is being changed and not of other user
    if(req.user.id == req.params.id){
        try{
            let user = await User.findById(req.params.id);
            //used to parse the req part
            User.uploadedAvatar(req,res,async function(err){
                if(err){
                    console.log('**Multer Error: in Users Controller: ',err);
                }
                user.name = req.body.name;
                user.email = req.body.email;

                //if avatar update is also demanded by the user
                if(req.file){
                    
                    //using file type library to identify file type
                    const meta = await fileType.fromFile(req.file.path);

                    if(whitelist.includes(meta.mime)){

                        //if an avatar already exists,it deletes it before setting path to the new avatar
                        if(user.avatar){
                            let currentAvatar = user.avatar;
                            let fileExists = true;
                            //if user has an avatar but the file got deleted somehow
                            fs.access(path.join(__dirname,'..',user.avatar),fs.constants.F_OK,(err)=>{
                                if(err){
                                    fileExists = false;
                                }
                                if(fileExists){
                                    fs.unlinkSync(path.join(__dirname,'..',currentAvatar));
                                }
                            });   
                        }

                        //this is saving the path of the uploaded file into the avatar field of the user Model
                        user.avatar = User.avatarPath + '/' + req.file.filename;
                    }else{
                        //delete the file from the server
                        let pathOfFileToDelete = path.join(__dirname,'..',User.avatarPath + '/' + req.file.filename);
                        fs.unlinkSync(pathOfFileToDelete);
                        req.flash('error','Wrong file type');
                        return res.redirect('back');
                    }

                }
                //user.save is kept outside file handling block so that name or email changes also get implemented
                user.save();

                //handling th ajax request
                if(req.xhr){
                    return res.status(200).json({
                        data:{
                            user:{
                                name:user.name,
                                email:user.email,
                                avatar:user.avatar
                            }
                        },
                        message:"User Updated!"
                    });
                }
                return res.redirect('back');
            });

        }catch(err){
            console.log('Error in Users Controller');
            req.flash('error',err);
            console.log('Error: ',err);
            return res.redirect('back');
        }
    }else{
        req.flash('error','Unauthorized');
        return res.status(401).send('Unauthorized');
    }
}

//forgot password 
module.exports.forgotPassword = function(req,res){
    return res.render('forgot-password');
}

//reset password initiate request
module.exports.resetPasswordInitiate = async function(req,res){
    try{
        //check if user exists for the given email
        let user = await User.findOne({email:req.body.email});

        // if no such user exists
        if(!user){
            req.flash('error','Invalid Email');
            return res.redirect('/');
        }
        
        //if user exists then
        //create an object called resetPasswordToken in the schema
        let token = await ResetPasswordToken.create({
            accessToken:crypto.randomBytes(20).toString('hex'),
            user:user.id,
            isValid:true
        });

        console.log('Token Created');

        //Populate the token with the details necessary to send the email
        await token.populate('user','email name');

        //send an email to the user with a reset password link
        //pass the token object as data to the email function
        resetPasswordMailer.resetPasswordMail(token);

        //send the user a flash to check his email and proceed the journey from there
        req.flash('success','Check your email for reset password link');
        return res.redirect('/');
    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}

module.exports.resetPassword = async function(req,res){
    try{    
        //see if the access token is valid
        let token = await ResetPasswordToken.findOne({accessToken:req.params.accessToken});

        //if the token is valid send the user to the reset password page
        if(token){
            if(token.isValid){
                return res.render('reset-password',{token:token});
            }else{
                req.flash('error','Link to reset password expired');
                return res.redirect('/users/sign-in');
            }
        }else{
            req.flash('error','Link to reset password expired');
            return res.redirect('/users/sign-in');
        }
    }catch(err){
        console.log(err);
        return res.redirect('back');
    }

    
}

//finally change the password post the verification checks
//also delete the token post the password has been changed
module.exports.changePassword = async function(req,res){
    let match = false;

    try{

        //confirm if passwords match
        if(req.body.password == req.body.confirm_password){
            match = true;
        }else{
            req.flash('error','passwords do not match');
            return res.redirect('back');
        }

        //check if token is valid
        let token = await ResetPasswordToken.findById(req.body.token);
        if(token && match){

            //putting isValid check inside coz in absence of the token reading the value of undefined would have thrown an error
            if(token.isValid){
                //fetch user
                let user = await User.findById(token.user);

                //update user's password
                user.password = req.body.password;
                user.save();

                //make token invalid -> this is an extra check in case an error occurs in deleting the token
                token.isValid = false;
                token.save();

                //delete token
                await token.remove();

                //deliver success message
                req.flash('success','Password reset successful');

                //redirect user to sign in page
                res.redirect('/users/sign-in');

            }else{
                req.flash('error','Link to reset password expired');
                return res.redirect('/users/sign-in');
            }
        }else{
            req.flash('error','Link to reset password expired');
            return res.redirect('/users/sign-in');
        }

    }catch(err){
        console.log(err);
        return res.redirect('back');
    }

}

//Friendship Controllers
//Add friend
module.exports.addFriend = async function(req,res){
    try{
        //TODO Handle Duplication

        let fromUser = await User.findOne({_id:req.user._id});
        let toUser = await User.findOne({_id:req.params.id});

        //check if friendship already exists
        let exists = toUser.friendships.includes(fromUser._id);

        if(exists){
            // console.log('exists');
            req.flash('error','Already a friend');
            return res.redirect('back');

        }

        //add userId to friends array of user
        fromUser.friendships.push(toUser);
        toUser.friendships.push(fromUser);
        fromUser.save();
        toUser.save();

        return res.redirect('back');
        
    }catch(err){
        console.log(err);
    }

}

//Remove Friend
module.exports.removeFriend = async function(req,res){
    try{
        let removingUser = await User.findById(req.user._id);
        let removedUser = await User.findById(req.params.id);
        removingUser.friendships.pull(req.params.id);
        removingUser.save();
        removedUser.friendships.pull(req.user._id);
        removedUser.save();

        return res.redirect('back');
    }catch(err){
        console.log(err);
    }
}