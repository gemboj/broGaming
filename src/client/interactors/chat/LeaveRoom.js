function LeaveRoom(send, removeRoom){
    var that = this;
    
    this.do = function(roomId){
        return send('leaveRoom', {roomId: roomId})
            .then(function(roomId){
                removeRoom(roomId);
            })
            .catch(function(err){
                console.log(err);
            });
    }
}