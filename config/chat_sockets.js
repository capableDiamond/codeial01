//this file is going to be the observer of the server whic is going to receive all the incoming connections from the users which are the listeners
module.exports.chatSockets = function(socketServer){
    let io = require('socket.io')(socketServer);

    //once this connection establishes this sends back an acknowledgement that connection has been established by emmiting a connect event automatically
    //.on detects an event sent by the client
    io.sockets.on('connection',function(socket){
        console.log('new connection received',socket.id);

        //whenever the client disconnects an qutomatic disconnect event is fired
        socket.on('disconnect',function(){
            console.log('socket-disconnected!')
        });

        socket.on('join_room',function(data){
            console.log('joining request received',data);

            //when the joining request has been received I want that socket to be joined to that particular room
            //if a chatroom with the given name exists than the user will be connected to that chatroom
            //if it does not exists it will create the chatroom and enter the user into it
            socket.join(data.chatroom);

            //a notification to other users of the chatroom should be sent about this user joining the chatroom
            //xyz friend is online
            io.in(data.chatroom).emit('user_joined',data);
        });

        //detect send message and broadcast to everyone
        socket.on('send_message',function(data){
            io.in(data.chatroom).emit('receive_message',data);
        });
    })
}