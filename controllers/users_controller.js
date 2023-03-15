const User = require('../models/user');

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
    return res.redirect('/');
}

module.exports.destroySession = function(req,res){
    req.logout(function(err){//logout is a function of passport library
        if(err){console.log('Error in Logging out');return;}
        res.redirect('/');
    });
}

module.exports.update = function(req,res){
    //to check if the info of the logged in user is being changed and not of other user
    if(req.user.id == req.params.id){
        User.findByIdAndUpdate(req.params.id,req.body,function(err,user){
            return res.redirect('back');
        });
    }else{
        return res.status(401).send('Unauthorized');
    }
}