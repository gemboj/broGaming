function CreateRoom(insertRoom, getNextRoomid, joinRoom){

    this.do = function(roomName, username){
        var roomId = null;
        return getNextRoomid()
            .then(function(id){
                roomId = id;
                return insertRoom(new Room(id, roomName, true, [], username))
            })
            .then(function(){
                return joinRoom(username, roomId)
            });
    };
}