const Comment = require('../models/comments');
const Post = require('../models/post');
const Like = require('../models/like');

const commentsMailer = require('../mailers/comments_mailer');
const queue = require('../config/kue');

//the worker which is going to send the email
const commentEmailWorker = require('../workers/comment_email_worker');

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

            // comment = await comment.populate('user','name email');
            // comment = await comment.populate('post','user');
            comment = await comment.populate([
                {
                    path:'user',
                    select:'name email'
                },
                {
                    path:'post',
                    select:'user'
                },
                {
                    path:'likes',
                }
            ]);
            // commentsMailer.newComment(comment);

            /*  we pass the function to the que 
                every task that we put into the queue is a job
                with this function we are putting a new job inside the queue
                if the queue does not exists a new queue will be created or if it exists it will just push the job
            */
            let job = queue.create('emails',comment).save(function(err){
                if(err){console.log('error in sending to the queue',err);return;}

                // console.log('job enqueued',job.id);
            });

            if(req.xhr){

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
            //delete the comment from the db
            comment.remove();

            //remove the reference of this comment from the post on which the comment was made
            await post.update({$pull: {comments:req.params.id}});

            //delete all the likes pertaining to this comment
            await Like.deleteMany({likeable:req.params.id});
            
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

