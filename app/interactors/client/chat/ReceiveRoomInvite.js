function ReceiveRoomInvite(addInvite, send, newRoom, createApp){
    var that = this;
    
    this.do = function(sender, roomName, roomId, app){
        return addInvite(sender + " invites you to room: " + roomName)
            .then(function(){
                return send('joinRoom', {roomId: roomId})
                    .then(function(joinData){
                        var room = newRoom(joinData.id, joinData.name, joinData.usernames, joinData.host)

                        if(app){
                            createApp(app, room);
                        }
                    })
            })
            .catch(function(){

            });
    }
}