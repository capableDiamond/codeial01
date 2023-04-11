//the file that is going to be communicating from the client side
class ChatEngine{
    constructor(chatBoxId,userEmail){
        this.chatBox = $(`${chatBoxId}`);
        this.userEmail = userEmail;

        //sending the connect request
        //this connect will fire an event connection which is handled on the server side
        this.socket = io.connect('http://localhost:5000');

        //calling the connection handler which detects if the request has been completed
        if(this.userEmail){
            this.connectionHandler();
        }
    }

    connectionHandler(){
        let self = this;

        this.socket.on('connect',function(){
            console.log('connection established using sockets...!');

            //we could have named it anything instead of 'join_room', we should make it corresponding to the event on the server side ie it should be meaningful
            //when this event will be emitted it will be recd on chat sockets at the backend
            self.socket.emit('join_room',{
                //sending data regarding which chat room to join
                user_email:self.userEmail,
                chatroom:'codeial'
            });

            self.socket.on('user_joined',function(data){
                console.log('a user joined',data);
            });
        });

        //send a message on clicking the send button
        $('#send-message').click(function(){
            let msg = $('#chat-message-input').val();
            
            if(msg != ''){
                self.socket.emit('send_message',{
                    message:msg,
                    user_email:self.userEmail,
                    chatroom:'codeial'
                });
            }
        });

        //receiving a message and showing it on the frontend
        self.socket.on('receive_message',function(data){
            console.log(`message received ${data.message}`);

            let newMessage = $('<li>');
            let messageType = 'other-message';
            //to differentiate between other user's and our own messages
            if(data.user_email === self.userEmail){
                messageType = 'self-message';
            }

            newMessage.append($('<span>',{
                'html':data.message
            }));

            newMessage.append($('<sub>',{
                'html':data.user_email
            }));

            newMessage.addClass(messageType);

            $('#chat-messages-list').append(newMessage);
        });
    }
}