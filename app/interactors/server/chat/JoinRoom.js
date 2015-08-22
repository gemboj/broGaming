function JoinRoom(transaction, usernameJoinsRoomid, getUsersInRoomId, send){
    var that = this;


    that.do = function(username, roomId){
        roomId = roomId === undefined ? 0 : roomId;

        return transaction(function(t){
            return usernameJoinsRoomid(username, roomId, t)
                .then(function(){
                    return getUsersInRoomId(roomId, t);
                })
        })
            .then(function(users){
                var data = {};
                data[roomId] = users;
                send(username, 'roomUsers', data);
            })
            .catch(function(err){
                throw err;
            });
    }
}