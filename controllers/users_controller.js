module.exports.profile = function(req,res){
    return res.render('users',{
        title:'users'
    });

    // res.end('<h1>User Profile</h1>');
}