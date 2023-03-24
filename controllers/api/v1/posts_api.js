const Post = require('../../../models/post');

module.exports.index = async function(req,res){
    //first we find all the posts and then we populate all the users in the posts and then we call the callback function
    let posts = await Post.find({})
    .sort({_id:-1})
    .populate('user','name email')
    .populate(
        {
        path:'comments',options:{sort:{_id:-1}} ,//this comment refers to the comment in the Post model
        populate:{
            path:'user' //this user refers to the user in the comments model
        }//multi level populating happens
        
    });

    return res.json(200,{
        message:"List of Posts",
        posts:posts
    });
}