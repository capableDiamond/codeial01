const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comments');
const Like = require('../models/like');

module.exports.home = async function(req,res){
    try{
        //Ran this block of code just once to include likes field in all old posts
        // Post.updateMany({},{$set:{likes:[]}},function(err,docs){
        //     if (err){
        //         console.log(err)
        //     }
        //     else{
        //         console.log("Updated Docs : ", docs);
        //     }
        // });

        //Update old comments for likes arr
        // Comment.updateMany({},{$set:{likes:[]}},function(err,docs){
        //     if (err){
        //         console.log(err)
        //     }
        //     else{
        //         console.log("Updated Docs : ", docs);
        //     }
        // });

        //first we find all the posts and then we populate all the users in the posts and then we call the callback function
        // let posts = await Post.find({})
        // .sort({_id:-1})
        // .populate('user','name email _id')
        // .populate('likes')
        // .populate(
        //     {
        //     path:'comments',
        //     options:{sort:{_id:-1}},//this comment refers to the comment in the Post model
        //     populate:{
        //         path:'user' //this user refers to the user in the comments model
        //     }//multi level populating happens
            
        // });

        let posts = await Post.find({})
        .sort({_id:-1})
        .populate([
            {
                path:'user',
                select:'name email _id',
            },
            {
                path:'likes'
            },
            {
                path:'comments',
                options:{sort:{_id:-1}},
                populate:[
                    {
                        path:'user',
                        select:'name email _id'
                    },
                    {
                        path:'likes'
                    }
                ]
            }
        ]);

        let users = await User.find({});

        //see if the page is being accessed by a signed in user or a non signed in user
        if(req.user){
            //fetch info of all things liked by user
            let likedByUser = await Like.find({user:req.user._id}).populate('user');
            return res.render('home',{
                title:"Codeial | Home",
                posts:posts,
                all_users:users,
                likedByUser:likedByUser
            });
        }

        //if the user is not signed in
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