//setting up the values of env variables to the process object in node using dotenv package
//loading it above oAuth so that the variables get defined before they are requested in the auth configs
require('dotenv').config();
const express = require('express');
const env = require('./config/environment');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const app = express();

require('./config/view-helpers')(app);
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
//used for session cookie
const session = require('express-session');
const passport = require('passport');

const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const MongoStore = require('connect-mongo')(session);
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');

//setting up the chat server to be used with socket.io
//passed the express app server to it
const chatServer = require('http').Server(app);

//passed on this http chatServer to a chatsockets function in configs
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);

//this chat server is now listening to port 5000
chatServer.listen(5000);//setting up port for this server
console.log('Chat server is listening on port 5000');

//setting up paths
const path = require('path');

if(env.name == 'development'){
    app.use(sassMiddleware({
        src: path.join(__dirname,env.asset_path,'scss'),
        dest: path.join(__dirname,env.asset_path,'css'),
        debug:false,
        outputStyle:'expanded',
        prefix:'/css'
    }));
}

app.use(express.urlencoded());

app.use(cookieParser());

app.use(express.static(env.asset_path));

//makes the upload path available to the browser
//for the route /uploads use express.static to find the path
app.use('/uploads',express.static(__dirname + '/uploads'));

//setup morgan for logging
app.use(logger(env.morgan.mode,env.morgan.options));

app.use(expressLayouts);

//extract styles and scripts from sub pages(variable part of a page) into the layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);


//setting up view engine ejs
app.set('view engine','ejs');
app.set('views','./views');

//mongo store is used to store the session cookie in the db
app.use(session({
    name:'codeial',
    //TODO change the secret before deployment in production mode
    secret:env.session_cookie_key,
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*100)
    },
    store: new MongoStore({
        mongooseConnection:db,
        autoRemove:'disabled'
    },function(err){
        console.log(err || 'connect-mongoDB setup ok');
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

//setup after sessions coz it uses session cookies
app.use(flash());
app.use(customMware.setFlash);

//use express router
//require the index of routes, it is via this file all other routes are made accessible
app.use('/',require('./routes'));

app.listen(port,(err) =>{
    if(err){
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server listening on port: ${port}`);
});