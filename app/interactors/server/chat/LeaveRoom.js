function LeaveRoom(getRoomWithUsersById, send, removeUsernameFromRoomid, removeRoomById){
    var that = this;

    this.do = function(username, roomId){
        return getRoomWithUsersById(roomId)
            .then(function(room){
                for(var i = 0; i < room.users.length; ++i){
                    if(room.users[i].username !== username){
                        send(room.users[i].username, 'someoneLeftRoom', {roomId: roomId, username: username});
                    }
                }

                return removeUsernameFromRoomid(username, roomId)
                    .then(function(){
                        if(room.deletable){
                            return removeRoomById(roomId);
                        }
                    });

            })
            .then(function(arg){
                return roomId;
            })
    }
}