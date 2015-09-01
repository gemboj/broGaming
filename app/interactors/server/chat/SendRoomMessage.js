function SendRoomMessage(getRoomWithUsersById, send){
    var that = this;

    this.do = function(roomId, sendersUsername, message){
        return getRoomWithUsersById(roomId)
            .then(function(room){
                var users = room.users,
                    isInRoom = false,
                    usersNicks = [];
                for(var i = 0; i < users.length; ++i){
                    if(users[i].username === sendersUsername){
                        isInRoom = true;
                    }

                    usersNicks.push(users[i].username);
                }

                if(!isInRoom){
                    send(sendersUsername, 'error', 'you can not send messages to that room');
                    return ;
                }

                for(var i = 0; i < usersNicks.length; ++i){
                    send(usersNicks[i], 'roomMessage', {message: message, roomName: room.name, sender: sendersUsername});
                }
            })
    }
}