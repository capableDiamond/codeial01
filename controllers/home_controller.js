const Post = require('../models/post');

module.exports.home = function(req,res){
    // Post.find({},function(err,posts){
    //     if(err){console.log('Error in fetching posts from db');return;}

    //     return res.render('home',{
    //         title:"Codeial | Home",
    //         posts:posts
    //     });
    // });

    //first we find all the posts and then we populate all the users in the posts and then we call the callback function
    Post.find({})
    .populate('user')
    .populate({
        path:'comments', //this comment refers to the comment in the Post model
        populate:{
            path:'user' //this user refers to the user in the comments model
        }
        //multi level populating happens
    })
    .exec(function(err,posts){
        if(err){console.log('Error in fetching posts from db in home controller',err);return;}

        return res.render('home',{
            title:"Codeial | Home",
            posts:posts
        });
    });


}