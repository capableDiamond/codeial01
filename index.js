const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');

app.use(express.urlencoded());

app.use(cookieParser());

app.use(express.static('./assets'));
app.use(expressLayouts);

//extract styles and scripts from sub pages(variable part of a page) into the layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

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