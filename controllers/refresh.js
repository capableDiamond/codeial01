const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comments');
const Like = require('../models/like');

//Ran this block of code just once to include likes field in all old posts
Post.updateMany({likes:{$exists:false}},{$set:{likes:[]}},function(err,docs){
    if (err){
        console.log(err)
    }
    else{
        console.log("Updated Posts : ", docs);
    }
});

//Update old comments for likes arr
Comment.updateMany({likes:{$exists:false}},{$set:{likes:[]}},function(err,docs){
    if (err){
        console.log(err)
    }
    else{
        console.log("Updated Comments : ", docs);
    }
});

//Update old users for friendships array
User.updateMany({friendships:{$exists:false}},{$set:{friendships:[]}},function(err,docs){
    if (err){
        console.log(err)
    }
    else{
        console.log("Updated Users : ", docs);
    }
})