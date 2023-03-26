const User = require('../../../models/user');
const jwt = require('jsonwebtoken');

module.exports.createSession = async function(req,res){
//whenever a username and pwd is received we need to create a jwt corresponding to it
    try{
        let user = await User.findOne({email: req.body.email});

        if(!user || user.password != req.body.password){
            return res.json(422,{
                message:"Invalid Username or Password"
            });
        }

        return res.json(200,{
            message:'Sign in succesful! Here is your token,please keep it safe!',
            data:{
                token:jwt.sign(user.toJSON(),'codeial',{expiresIn:'100000'})//will set the token and send it ot the user
            }
        })

    }catch(err){
        console.log('*******',err);
        return res.json(500,{
            message:'Internal Sever Error'
        });
    }
}

