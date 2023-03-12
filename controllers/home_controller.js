const Post = require('../models/post');

module.exports.home = function(req,res){
    // Post.find({},function(err,posts){
    //     if(err){console.log('Error in fetching posts from db');return;}

    //     return res.render('home',{
    //         title:"Codeial | Home",
    //         posts:posts
    //     });
    // });

    //first we find all the posts and then we populate alt eh users in the posts and then we call the callback function
    Post.find({}).populate('user').exec(function(err,posts){
        if(err){console.log('Error in fetching posts from db');return;}

        return res.render('home',{
            title:"Codeial | Home",
            posts:posts
        });
    });


}