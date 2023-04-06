const Post = require('../models/post');
const Comment = require('../models/comments');
const Like = require('../models/like');

// module.exports.create = function(req,res){
//     Post.create({
//         content:req.body.content,
//         user:req.user._id// this was set by the set authenticated user function created in passport local strategy in config
//         // comments:req.user._id //just doing this so that this field get initiated later will update this value
//     },function(err,post){
//         if(err){console.log('Error in creating a post');}
//         return res.redirect('back');
//     });
// }

module.exports.create = async function(req,res){
    try{
        let post = await Post.create(
            {
                content:req.body.content,
                user:req.user._id
            }
        );
        
        if(req.xhr){
            post = await post.populate('user','name');
            return res.status(200).json({
                data:{
                    post:post
                },
                message: 'Post Created!'
            });
        }

        req.flash('success','Post Created');
        return res.redirect('back');

    }catch(err){
        req.flash('error','Error in Creating a post!');
        console.log('Error in creating a post',err);
        return res.redirect('back');
    }
}

// module.exports.destroy = function(req,res){
//     Post.findById(req.params.id,function(err,post){
//         //to verify if the user requesting the delete action is the author of the post
//         if(post.user == req.user.id){//using .id instead of _id converts the id into a string so that it can be compared
//             post.remove();

//             //deleting the comments on the post
//             //delete all the comments having the post's id
//             Comment.deleteMany({post:req.params.id},function(err){
//                 if(err){console.log(err);return;}
//                 return res.redirect('back');
//             });

//         }else{
//             //TODO error handling warning the user
//             return res.redirect('back');
//         }
//     });
// }

module.exports.destroy = async function(req,res){
    try{
        let post = await Post.findById(req.params.id);

        if(post.user = req.user.id){
            post.remove();

            //fetched all the comments so that later these could be used to delete the likes on these comments from the db
            let comments = await Comment.find({post:req.params.id});

            //deleting Comments related to the post
            await Comment.deleteMany({post:req.params.id});

            //deleting the likes on the post
            await Like.deleteMany({likeable:req.params.id});

            //deleting the likes on the post's comment
            for(i of comments){
                await Like.deleteMany({likeable:i._id});
            }
            
            // await Like.deleteMany({_id:{$in:post.comments}});

            if(req.xhr){
                return res.status(200).json({
                    data:{
                        post_id:req.params.id
                    },
                    message: "Post Deleted"
                });
            }

            req.flash('success','Post and associated Comments deleted');
            return res.redirect('back');

        }else{
            req.flash('error','User unauthorized to delete post');
            return res.redirect('back');
        }
    }catch(err){
        console.log(err);
        console.log('Error in deleting Post at Posts Controller');
        req.flash('error','Error in deleteing Post');
        return res.redirect('back');
    }
}