function CreateRoom(send, cb, showError){
    var that = this;

    this.do = function(name){
        return send('createRoom', {roomName: name})
            .then(function(roomData){
                return cb(roomData.id, roomData.name, roomData.usernames, roomData.host)
            })
            .catch(function(err){
                showError(err);
            })
    }
}