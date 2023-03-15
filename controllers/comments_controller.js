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

module.exports.destroy = function(req,res){
    Comment.findById(req.params.id,function(err,comment){
        if(err){console.log(err);return;}
        //TODO learn to implement asycn with help of promises
        let postId = comment.post;
        let postOwner;
        Post.findById(postId,function(err,post){
            postOwner = post.user.toString();

            if(comment.user == req.user.id || req.user.id == postOwner){
                comment.remove();

                post.update({$pull: {comments:req.params.id}},function(err,post){
                    return res.redirect('back');
            });
            }else{
                console.log('User not allowed to delete comment');
                return res.redirect('back');
            }

        })
    })
}