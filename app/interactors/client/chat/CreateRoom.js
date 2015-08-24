function CreateRoom(send, addRoom){
    var that = this;

    this.do = function(name){
        return send('createRoom', {roomName: name})
            .then(function(room){
                return addRoom(room);
            })
    }
}