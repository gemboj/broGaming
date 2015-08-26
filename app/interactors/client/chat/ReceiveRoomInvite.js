function ReceiveRoomInvite(addInvite, send, addRoom){
    var that = this;
    
    this.do = function(data){
        return addInvite(data.sendersUsername + " invites you to room: " + data.roomName)
            .then(function(){
                send('joinRoom', {roomId: data.roomId})
                    .then(function(data){
                        addRoom(data)
                    })
            })
            .catch(function(){

            });
    }
}