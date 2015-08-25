function ReceiveRoomInvite(showRoomInvite, send, addRoom){
    var that = this;
    
    this.do = function(data){
        return showRoomInvite(data.roomName)
            .then(function(){
                send('joinRoom', {roomId: data.roomId})
                    .then(function(data){
                        addRoom(data)
                    });
            });
    }
}