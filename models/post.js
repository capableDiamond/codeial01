const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    //we need to link the post to a user
    user:{
        type:mongoose.Schema.Types.ObjectId,//this is the reference to the user that is passed
        ref:'User'//refer to the user schema
    }
},{
    timeStamps:true
});

const Post = mongoose.model('Post',postSchema);

module.exports = Post;