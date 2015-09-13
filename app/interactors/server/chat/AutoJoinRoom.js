function AutoJoinRoom(usernameJoinsRoomid, send){
    var that = this;

    this.do = function(username){
        return usernameJoinsRoomid(username, 0)
            .then(function(roomData){
                send(username, 'joinedRoom', roomData)
            })
            .catch(function(err){

            })
    }
}