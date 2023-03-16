const Post = require('../models/post');
const Comment = require('../models/comments');

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
        )
        return res.redirect('back');

    }catch{
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
    
            Comment.deleteMany({post:req.params.id},function(err){
                if(err){console.log(err);return;}
                return res.redirect('back');
            });
        }else{
            console.log('User not allowed to delete post');
            return res.redirect('back');
        }
    }catch{
        console.error();
        console.log('Error in deleting Post');
        return res.redirect('back');
    }
}