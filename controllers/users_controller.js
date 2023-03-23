const User = require('../models/user');

//require the file system to delete the previous avatar images
const fs = require('fs');
const path = require('path');

const fileType = require('file-type');


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