function ReceiveRoomInvite(addInvite, send, newRoom, createApp){
    var that = this;
    
    this.do = function(inviteData){
        return addInvite(inviteData.sendersUsername + " invites you to room: " + inviteData.roomName)
            .then(function(){
                return send('joinRoom', {roomId: inviteData.roomId})
                    .then(function(joinData){
                        var room = newRoom(joinData)

                        if(inviteData.app){
                            createApp(inviteData.app, room);
                        }
                    })
            })
            .catch(function(){

            });
    }
}