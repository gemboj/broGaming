function SendRoomData(getRoomWithUsersById, send){
    var that = this;

    this.do = function(roomId, sendersUsername, data){
        return getRoomWithUsersById(roomId)
            .then(function(room){
                var users = room.users,
                    isInRoom = false,
                    otherUsers = [];
                for(var i = 0; i < users.length; ++i){
                    if(users[i].username === sendersUsername){
                        isInRoom = true;
                    }
                    else{
                        otherUsers.push(users[i].username);
                    }
                }

                if(!isInRoom){
                    send(sendersUsername, 'error', 'you can not send messages to that room');
                    return ;
                }

                for(var i = 0; i < otherUsers.length; ++i){
                    send(otherUsers[i], data.type, data.data);
                }
            })
    }
}