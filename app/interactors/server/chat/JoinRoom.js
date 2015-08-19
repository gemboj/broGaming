function JoinRoom(usernameJoinsRoomid, getUsersInRoomId, send){
    var that = this;

    that.do = function(username, roomId){
        roomId = roomId === undefined ? 0 : roomId;
        return usernameJoinsRoomid(username, roomId)
            .then(function(){
                return getUsersInRoomId(roomId);
            })
            .then(function(users){
                var data = {};
                data[roomId] = users
                send(username, 'roomUsers', data);
            })
            .catch(function(err){
                console.log(err);
            });
    }
}