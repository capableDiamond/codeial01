const env = require('./environment');
const fs = require('fs');
const path = require('path');

module.exports = (app) =>{
    //defining a global function which will be there in the app(global object)
    app.locals.assetPath = function(filePath){
        if(env.name == 'development'){
            return filePath;
        }

        //else
        return JSON.parse(fs.readFileSync(path.join(__dirname,'../public/assets/rev-manifest.json')))[filePath];
    }
}