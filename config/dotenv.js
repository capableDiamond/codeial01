//this module gathers all the environment variables 
//makes it easy to see thema ll at once and map them to readable names
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    username:process.env.MAIL_USERNAME,
    pass:process.env.MAIL_PASSWORD
}

console.log('DOTENV Enabled');