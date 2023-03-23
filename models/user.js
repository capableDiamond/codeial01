const mongoose = require('mongoose');

//setting up multer individually for the models where it is reqd
//files where multer is used -> users controller,index.js
const multer = require('multer');
const path = require('path');
const AVATAR_PATH = path.join('/uploads/users/avatars');

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    avatar:{//field to store the path of the file
        type:String
    }
},{
    timestamps:true
});

//defining storage properties for multer
let storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'..',AVATAR_PATH));
    },
    filename: function(req,file,cb){
        cb(null,file.fieldname +'-'+Date.now());
        //fieldname above refers to the field(key) assigned for the file in the database,here avatar
    }
});

//static methods --> functions that run on the whole class and not on an individual obejct
// this defines that only a single file can be uploaded for the field avatar
userSchema.statics.uploadedAvatar = multer({storage:storage}).single('avatar');

//making the avatar path publicly available by defining a static
userSchema.statics.avatarPath = AVATAR_PATH;

const user = mongoose.model('User',userSchema);

module.exports = user;