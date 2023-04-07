const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comments');
const Like = require('../models/like');

//require this file whenever we make some change in a schema to update the previous object instances with the changes
// const changes = require('./refresh');

module.exports.home = async function(req,res){
    try{
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
            let currentUsersFriends = await User.findById(req.user._id).populate('friendships');
            //fetch info of all things liked by user
            let likedByUser = await Like.find({user:req.user._id}).populate({path:'user',select:'name'});
            return res.render('home',{
                title:"Codeial | Home",
                posts:posts,
                all_users:users,
                likedByUser:likedByUser,
                currentUsersFriends:currentUsersFriends
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