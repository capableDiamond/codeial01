const kue = require('kue');

const queue = kue.createQueue();

module.exports = queue;

//comand for redis
//redis-server --port 6380 --slaveof 127.0.0.1 6379