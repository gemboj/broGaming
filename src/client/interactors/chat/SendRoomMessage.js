function SendRoomMessage(send){
    var that = this;

    this.do = function(roomId, message){
        return send('roomMessage', {roomId: roomId, message: message});
    }
}