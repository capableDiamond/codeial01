const Comment = require('../models/comments');
const Post = require('../models/post');

// module.exports.create = function(req,res){
//     Post.findById(req.body.post,function(err,post){
//         if(err){console.log('error in finding the post for adding comment');return;}
//         if(post){
//             Comment.create({
//                 content:req.body.content,
//                 post:req.body.post,
//                 user:req.user._id
//             },function(err,comment){
//                 if(err){console.log('Error in Creating a comment');return;}

//                 post.comments.push(comment);
//                 post.save();
                
//                 return res.redirect('/');
//             });
//         }
//     });
// }

module.exports.create = async function(req,res){
    try{
        let post = await Post.findById(req.body.post);
        if(post)
        {
            let comment = await Comment.create({
                content:req.body.content,
                post:req.body.post,
                user:req.user._id
            });
            
            post.comments.push(comment);
            post.save();//whenever we update anything we need to call save after it

            if(req.xhr){
                comment = await comment.populate('user','name');
                comment = await comment.populate('post','user');
                return res.status(200).json({
                    data:{
                        comment:comment
                    },
                    message: "Post Created!"
                });
            }

            req.flash('success', 'Comment published!');
            return res.redirect('/');
        }
    }catch(err){
        console.log('Error in Comments Controller',err);
        return;
    }

}

// module.exports.destroy = function(req,res){
//     Comment.findById(req.params.id,function(err,comment){
//         if(err){console.log(err);return;}
//         //TODO learn to implement asycn with help of promises
//         let postId = comment.post;
//         let postOwner;
//         Post.findById(postId,function(err,post){
//             postOwner = post.user.toString();

//             if(comment.user == req.user.id || req.user.id == postOwner){
//                 comment.remove();

//                 post.update({$pull: {comments:req.params.id}},function(err,post){
//                     return res.redirect('back');
//             });
//             }else{
//                 console.log('User not allowed to delete comment');
//                 return res.redirect('back');
//             }

//         })
//     })
// }

module.exports.destroy = async function(req,res){
    try{
        let comment = await Comment.findById(req.params.id);
        let post = await Post.findById(comment.post.toString());
        let postOwner = post.user.toString();
    
        if(comment.user == req.user.id || req.user.id == postOwner){
            comment.remove();
            let x = await post.update({$pull: {comments:req.params.id}});

            if(req.xhr){
                return res.status(200).json({
                    data:{
                        commentId:req.params.id
                    },
                    message:"Comment Deleted"
                });
            }

            return res.redirect('back');
        }else{
            console.log('User not allowed to delete comment');
            return res.redirect('back');
        }
    }catch(err){
        console.log(err);return;
    }

}

