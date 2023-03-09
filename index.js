const express = require('express');
const app = express();

const port = 8000;

//use express router
//require the index of routes, it is via this file all other routes are made accessible
app.use('/',require('./routes'));

//setting up view engine ejs
app.set('view engine','ejs');
app.set('views','./views');

app.listen(port,(err) =>{
    if(err){
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server listening on port: ${port}`);
});