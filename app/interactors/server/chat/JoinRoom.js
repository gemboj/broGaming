function JoinRoom(usernameJoinsRoomid, getUsersInRoomId, sendUsers){
    var that = this;

    that.do = function(username, roomId){
        return usernameJoinsRoomid(username, (roomId === undefined ? 0 : roomId))
            .then(function(){
                return getUsersInRoomId(roomId);
            })
            .then(function(users){
                sendUsers(users);
                return;
            });
    }
}