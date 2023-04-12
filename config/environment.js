///thee variables for development environment


const development = {
    name:'development',
    asset_path:'./assets',
    session_cookie_key:'blahsomething',
    db:'codeial_development',
    smtp:{
        service:'gmail',
        auth:{
            type:'OAUTH2',
            user:process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
            clientId:process.env.OAUTH_CLIENTID,
            clientSecret: process.env.OAUTH_CLIENT_SECRET,
            refreshToken: process.env.OAUTH_REFRESH_TOKEN
        }
    },
    google_client_id:process.env.OAUTH_LOGIN_CLIENTID,
    google_client_secret:process.env.OAUTH_LOGIN_CLIENT_SECRET,
    google_call_back_url:"http://localhost:8000/users/auth/google/callback",
    jwt_secret:'codeial'
}

const production = {
    name:'production',
    asset_path:process.env.CODEIAL_ASSET_PATH,
    session_cookie_key:process.env.CODEIAL_SESSION_COOKIE_KEY,
    db:process.env.CODEIAL_DB,
    smtp:{
        service:'gmail',
        auth:{
            type:'OAUTH2',
            user:process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
            clientId:process.env.OAUTH_CLIENTID,
            clientSecret: process.env.OAUTH_CLIENT_SECRET,
            refreshToken: process.env.OAUTH_REFRESH_TOKEN
        }
    },
    google_client_id:process.env.OAUTH_LOGIN_CLIENTID,
    google_client_secret:process.env.OAUTH_LOGIN_CLIENT_SECRET,
    google_call_back_url:"http://localhost:8000/users/auth/google/callback",
    jwt_secret:process.env.CODEIAL_JWT_SECRET
}

// module.exports = eval(process.env.NODE_ENV)== undefined ? development:production;
module.exports = eval(process.env.NODE_ENV);