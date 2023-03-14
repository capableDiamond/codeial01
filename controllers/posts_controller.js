const Post = require('../models/post');

module.exports.create = function(req,res){
    Post.create({
        content:req.body.content,
        user:req.user._id,// this was set by the set authenticated user function created in passport local strategy in config
        // comments:req.user._id //just doing this so that this field get initiated later will update this value
    },function(err,post){
        if(err){console.log('Error in creating a post');return;}
        return res.redirect('back');
    });
}