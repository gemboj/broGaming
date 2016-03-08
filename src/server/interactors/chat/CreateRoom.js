function CreateRoom(insertRoom, getNextRoomid, joinRoom, transaction){

    this.do = function(roomName, username){
        var roomId = null;
        return transaction(function(t){
            return getNextRoomid()
                .then(function(id){
                    roomId = id;
                    return insertRoom(new Room(id, roomName, true, [], username), t)
                })
                .then(function(){
                    return joinRoom(username, roomId, t);
                })
                .catch(function(){
                    throw 'error creating room. Please try again later.'
                });
        })

    };
}