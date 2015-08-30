function CreateRoom(send, cb){
    var that = this;

    this.do = function(name){
        return send('createRoom', {roomName: name})
            .then(function(room){
                return cb(room)
            })
            .catch(function(err){
                throw err
            })
    }
}