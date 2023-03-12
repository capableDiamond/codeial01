const User = require('../models/user');

module.exports.profile = function(req,res){
    return res.render('users',{
        title:'users'
    });

    // res.end('<h1>User Profile</h1>');
}

//renders the sign up page
module.exports.signUp = function(req,res){
    if(req.isAuthenticated()){
       return res.redirect('/users/profile');
    }

    return res.render('user_sign_up',{
        title:'Codeial | Sign Up'
    });
}

//renders the sign in page
module.exports.signIn = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_in',{
        title:'Codeial | Sign in'
    });
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
    return res.redirect('/users/profile');
}

module.exports.destroySession = function(req,res){
    req.logout(function(err){
        if(err){console.log('Error in Logging out');return;}
        res.redirect('/');
    });
}