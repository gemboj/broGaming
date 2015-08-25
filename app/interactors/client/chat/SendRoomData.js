function SendRoomData(send){
    var that = this;

    this.do = function(roomId, event, data){
        return send('sendRoomData', {roomId: roomId, data: {type: event, data: data}});
    }
}