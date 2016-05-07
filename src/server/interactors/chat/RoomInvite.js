function RoomInvite(send, getRoomWithUsersById){
    var that = this;

    this.do = function(sendersUsername, receiverUsername, roomId, appName){
        return getRoomWithUsersById(roomId)
            .catch(function(err){
                throw "Error sending invite";
            })
            .then(function(room){
                var users = room.users,
                    isInRoom = false;

                for(var i = 0; i < users.length; ++i){
                    if(users[i].username === sendersUsername){
                        isInRoom = true;
                    }
                }

                if(!isInRoom){
                    send(sendersUsername, 'error', 'you are in wrong room');
                    return;
                }

                send(receiverUsername, 'roomInvite', {sender: sendersUsername, roomId: roomId, roomName: room.name, app: appName});
            });
        //return send(receiverUsername, 'roomInvite', {sendersUsername: sendersUsername, roomName: roomName, roomId: roomId, app: appName})
    }
}