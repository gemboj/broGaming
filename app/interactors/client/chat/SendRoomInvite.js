function SendRoomInvite(send){
    var that = this;

    this.do = function(roomId, receiver, app){
        return send('roomInvite', {roomId: roomId, receiver: receiver, app: app});
    }
}