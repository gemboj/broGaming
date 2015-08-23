function CreateRoom(insertRoom, getNextRoomid, usernameJoinsRoomid){

    this.do = function(roomName, username){
        var roomId = null;
        return getNextRoomid()
            .then(function(id){
                roomId = id;
                return insertRoom(new Room(id, roomName, true, []))
            })
            .then(function(){
                return usernameJoinsRoomid(username, roomId)
            });
    };
}