const Comment = require('../models/comments');
const Post = require('../models/post');

module.exports.create = function(req,res){
    Post.findById(req.body.post,function(err,postToComment){
        if(err){console.log('error in finding the post for adding comment');return;}
        if(postToComment){
            Comment.create({
                content:req.body.content,
                post:req.body.post,
                user:req.user._id
            },function(err,comment){
                if(err){console.log('Error in Creating a comment');return;}
                
                try{
                    postToComment.comments.push(comment);
                    postToComment.save();
                    //this throws an error 
                }catch(err){
                    console.log('Error');
                }
                //whenever we update anything we need to call save after it
                
                //this can also be used instead of above function
                // postToComment.update(
                //     {_id:postToComment._id},
                //     {$push:{comments:comment}}
                // );

                return res.redirect('/');
            });
        }
    });
}