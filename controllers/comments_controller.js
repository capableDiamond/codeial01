const Comment = require('../models/comments');
const Post = require('../models/post');

module.exports.create = function(req,res){
    Post.findById(req.body.post,function(err,post){
        if(err){console.log('error in finding the post for adding comment');return;}
        if(post){
            Comment.create({
                content:req.body.content,
                post:req.body.post,
                user:req.user._id
            },function(err,comment){
                if(err){console.log('Error in Creating a comment');return;}

                post.comments.push(comment);
                post.save();//whenever we update anything we need to call save after it
                
                return res.redirect('/');
            });
        }
    });
}