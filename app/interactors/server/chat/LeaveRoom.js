function LeaveRoom(getRoomWithUsersById, send, removeUsernameFromRoomid, removeRoomById){
    var that = this;

    this.do = function(username, roomId){
        return getRoomWithUsersById(0)
            .then(function(room){
                for(var i = 0; i < room.users.length; ++i){
                    if(room.users[i].username !== username){
                        send(room.users[i].username, 'someoneLeavedRoom', {roomId: roomId, username: username});
                    }
                }

                return removeUsernameFromRoomid(username, roomId);
            })
            .then(function(){
                removeRoomById(roomId);
            });
    }
}