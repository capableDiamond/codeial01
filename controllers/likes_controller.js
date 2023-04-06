const Like = require('../models/like');
const Post = require('../models/post');
const Comment = require('../models/comments');

module.exports.toggleLike = async function(req,res){
    try{
        //likes/toggle/?id=abcdef&type=Post 
        let likeable;
        let deleted = false;

        if(req.query.type == 'Post'){
            // likeable = await Post.findById(req.query.id).populate('likes');
            likeable = await Post.findById(req.query.id)
            .populate([
            {
                path:'likes',
                model:'Like'
            }
        ]);

        //manually populating the likes field since populate function was not working for likes
        let a = likeable.populated('likes');
        likeable.likes = a;
        
        }else{
            //it is a comment
            likeable = await Comment.findById(req.query.id).populate('likes');
        }

        //check if a like already exists
        let existingLike = await Like.findOne({
            likeable:req.query.id,
            onModel:req.query.type,
            user:req.user._id
        })

        //if a like already exists then delete it
        if(existingLike){
            likeable.likes.pull(existingLike._id);
            likeable.save();

            existingLike.remove();
            deleted = true;
        }else{
            //create a like
            let newLike = await Like.create({
                user:req.user._id,
                likeable:req.query.id,
                onModel:req.query.type
            });

            //push the like into the post or comment'
            likeable.likes.push(newLike._id);
            likeable.save();
        }

        return res.status(200).json({
            message:"Request successful",
            data:{
                deleted:deleted,
                length:likeable.likes.length
            }
        });


    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal Server Error"
        });
    }
}