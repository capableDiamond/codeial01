const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function(req,res){
    try{
        //first we find all the posts and then we populate all the users in the posts and then we call the callback function
        let posts = await Post.find({})
        .populate('user')
        .populate(
            {
            path:'comments', //this comment refers to the comment in the Post model
            populate:{
                path:'user' //this user refers to the user in the comments model
            }//multi level populating happens
            
        });

        let users = await User.find({});

        return res.render('home',{
            title:"Codeial | Home",
            posts:posts,
            all_users:users
        });
    }catch(err){
        console.log('Error',err);
        return;
    }




}