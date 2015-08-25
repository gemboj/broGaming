function SendData(send){
    var that = this;

    this.do = function(receiver, event, data){
        return send('sendData', {receiver: receiver, data: {type: event, data: data}});
    }
}