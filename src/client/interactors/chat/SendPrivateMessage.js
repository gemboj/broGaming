function SendPrivateMessage(send){
    var that = this;

    this.do = function(receiver, message){
        return send('privateMessage', {receiver: receiver, message: message});
    }
}